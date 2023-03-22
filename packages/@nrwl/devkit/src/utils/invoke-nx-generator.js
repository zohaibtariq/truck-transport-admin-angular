"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNxGenerator = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@nrwl/tao/src/shared/logger");
const workspace_1 = require("@nrwl/tao/src/shared/workspace");
const json_1 = require("@nrwl/tao/src/utils/json");
const path_1 = require("path");
class RunCallbackTask {
    constructor(callback) {
        this.callback = callback;
    }
    toConfiguration() {
        return {
            name: 'RunCallback',
            options: {
                callback: this.callback,
            },
        };
    }
}
function createRunCallbackTask() {
    return {
        name: 'RunCallback',
        create: () => {
            return Promise.resolve(({ callback }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield callback();
            }));
        },
    };
}
/**
 * Convert an Nx Generator into an Angular Devkit Schematic
 */
function convertNxGenerator(generator) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (options) => invokeNxGenerator(generator, options);
}
exports.convertNxGenerator = convertNxGenerator;
/**
 * Create a Rule to invoke an Nx Generator
 */
function invokeNxGenerator(generator, options) {
    return (tree, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (context.engine.workflow) {
            const engineHost = context.engine.workflow.engineHost;
            engineHost.registerTaskExecutor(createRunCallbackTask());
        }
        const root = context.engine.workflow && context.engine.workflow.engineHost.paths
            ? context.engine.workflow.engineHost.paths[1]
            : tree.root.path;
        const adapterTree = new DevkitTreeFromAngularDevkitTree(tree, root);
        const result = yield generator(adapterTree, options);
        if (!result) {
            return adapterTree['tree'];
        }
        if (typeof result === 'function') {
            if (context.engine.workflow) {
                context.addTask(new RunCallbackTask(result));
            }
        }
    });
}
const actionToFileChangeMap = {
    c: 'CREATE',
    o: 'UPDATE',
    d: 'DELETE',
};
class DevkitTreeFromAngularDevkitTree {
    constructor(tree, _root) {
        this.tree = tree;
        this._root = _root;
    }
    get root() {
        return this._root;
    }
    children(dirPath) {
        const { subdirs, subfiles } = this.tree.getDir(dirPath);
        return [...subdirs, ...subfiles];
    }
    delete(filePath) {
        this.tree.delete(filePath);
    }
    exists(filePath) {
        if (this.isFile(filePath)) {
            return this.tree.exists(filePath);
        }
        else {
            return this.children(filePath).length > 0;
        }
    }
    isFile(filePath) {
        return this.tree.exists(filePath) && !!this.tree.read(filePath);
    }
    listChanges() {
        const fileChanges = [];
        for (const action of this.tree.actions) {
            if (action.kind === 'r') {
                fileChanges.push({
                    path: this.normalize(action.to),
                    type: 'CREATE',
                    content: this.read(action.to),
                });
                fileChanges.push({
                    path: this.normalize(action.path),
                    type: 'DELETE',
                    content: null,
                });
            }
            else if (action.kind === 'c' || action.kind === 'o') {
                fileChanges.push({
                    path: this.normalize(action.path),
                    type: actionToFileChangeMap[action.kind],
                    content: action.content,
                });
            }
            else {
                fileChanges.push({
                    path: this.normalize(action.path),
                    type: 'DELETE',
                    content: null,
                });
            }
        }
        return fileChanges;
    }
    normalize(path) {
        return path_1.relative(this.root, path_1.join(this.root, path));
    }
    read(filePath, encoding) {
        const rawResult = encoding
            ? this.tree.read(filePath).toString(encoding)
            : this.tree.read(filePath);
        if (isWorkspaceJsonChange(filePath)) {
            const formatted = workspace_1.toNewFormat(json_1.parseJson(Buffer.isBuffer(rawResult) ? rawResult.toString() : rawResult));
            return encoding ? json_1.serializeJson(formatted) : json_1.serializeJson(formatted);
        }
        return rawResult;
    }
    rename(from, to) {
        this.tree.rename(from, to);
    }
    write(filePath, content, options) {
        if (options === null || options === void 0 ? void 0 : options.mode) {
            this.warnUnsupportedFilePermissionsChange(filePath, options.mode);
        }
        if (isWorkspaceJsonChange(filePath)) {
            const w = json_1.parseJson(content.toString());
            for (const [project, configuration] of Object.entries(w.projects)) {
                if (typeof configuration === 'string') {
                    w.projects[project] = json_1.parseJson(this.tree.read(`${configuration}/project.json`));
                    w.projects[project].configFilePath = `${configuration}/project.json`;
                }
            }
            const formatted = workspace_1.toOldFormatOrNull(w);
            content = json_1.serializeJson(formatted ? formatted : w);
        }
        if (this.tree.exists(filePath)) {
            this.tree.overwrite(filePath, content);
        }
        else {
            this.tree.create(filePath, content);
        }
    }
    changePermissions(filePath, mode) {
        this.warnUnsupportedFilePermissionsChange(filePath, mode);
    }
    warnUnsupportedFilePermissionsChange(filePath, mode) {
        logger_1.logger.warn(logger_1.stripIndent(`The Angular DevKit tree does not support changing a file permissions.
                  Ignoring changing ${filePath} permissions to ${mode}.`));
    }
}
function isWorkspaceJsonChange(path) {
    return (path === 'workspace.json' ||
        path === '/workspace.json' ||
        path === 'angular.json' ||
        path === '/angular.json');
}
//# sourceMappingURL=invoke-nx-generator.js.map