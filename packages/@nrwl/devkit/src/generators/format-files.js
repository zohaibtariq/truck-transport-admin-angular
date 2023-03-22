"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFiles = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const get_workspace_layout_1 = require("../utils/get-workspace-layout");
const json_1 = require("../utils/json");
const object_sort_1 = require("@nrwl/tao/src/utils/object-sort");
const project_configuration_1 = require("./project-configuration");
/**
 * Formats all the created or updated files using Prettier
 * @param tree - the file system tree
 */
function formatFiles(tree) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let prettier;
        try {
            prettier = yield Promise.resolve().then(() => require('prettier'));
        }
        catch (_a) { }
        ensurePropertiesAreInNewLocations(tree);
        sortWorkspaceJson(tree);
        sortTsConfig(tree);
        if (!prettier)
            return;
        const files = new Set(tree.listChanges().filter((file) => file.type !== 'DELETE'));
        yield Promise.all(Array.from(files).map((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const systemPath = path.join(tree.root, file.path);
            let options = {
                filepath: systemPath,
            };
            const resolvedOptions = yield prettier.resolveConfig(systemPath, {
                editorconfig: true,
            });
            if (!resolvedOptions) {
                return;
            }
            options = Object.assign(Object.assign({}, options), resolvedOptions);
            const support = yield prettier.getFileInfo(systemPath);
            if (support.ignored || !support.inferredParser) {
                return;
            }
            try {
                tree.write(file.path, prettier.format(file.content.toString('utf-8'), options));
            }
            catch (e) {
                console.warn(`Could not format ${file.path}. Error: "${e.message}"`);
            }
        })));
    });
}
exports.formatFiles = formatFiles;
function sortWorkspaceJson(tree) {
    const workspaceJsonPath = get_workspace_layout_1.getWorkspacePath(tree);
    if (!workspaceJsonPath) {
        return;
    }
    try {
        const workspaceJson = json_1.readJson(tree, workspaceJsonPath);
        if (Object.entries(workspaceJson.projects).length !== 0) {
            const sortedProjects = object_sort_1.sortObjectByKeys(workspaceJson.projects);
            json_1.writeJson(tree, workspaceJsonPath, Object.assign(Object.assign({}, workspaceJson), { projects: sortedProjects }));
        }
    }
    catch (e) {
        // catch noop
    }
}
/**
 * `updateWorkspaceConfiguration` already handles
 * placing properties in their new locations, so
 * reading + updating it ensures that props are placed
 * correctly.
 */
function ensurePropertiesAreInNewLocations(tree) {
    const workspacePath = get_workspace_layout_1.getWorkspacePath(tree);
    if (!workspacePath) {
        return;
    }
    const wc = project_configuration_1.readWorkspaceConfiguration(tree);
    json_1.updateJson(tree, workspacePath, (json) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var _j, _k;
        (_a = wc.generators) !== null && _a !== void 0 ? _a : (wc.generators = (_b = json.generators) !== null && _b !== void 0 ? _b : json.schematics);
        if (wc.cli) {
            (_c = (_j = wc.cli).defaultCollection) !== null && _c !== void 0 ? _c : (_j.defaultCollection = (_d = json.cli) === null || _d === void 0 ? void 0 : _d.defaultCollection);
            (_e = (_k = wc.cli).packageManager) !== null && _e !== void 0 ? _e : (_k.packageManager = (_f = json.cli) === null || _f === void 0 ? void 0 : _f.packageManager);
        }
        else if (json.cli) {
            (_g = wc.cli) !== null && _g !== void 0 ? _g : (wc.cli = json.cli);
        }
        (_h = wc.defaultProject) !== null && _h !== void 0 ? _h : (wc.defaultProject = json.defaultProject);
        delete json.cli;
        delete json.defaultProject;
        delete json.schematics;
        delete json.generators;
        return json;
    });
    project_configuration_1.updateWorkspaceConfiguration(tree, wc);
}
function sortTsConfig(tree) {
    try {
        const tsconfig = json_1.readJson(tree, 'tsconfig.base.json');
        const sortedPaths = object_sort_1.sortObjectByKeys(tsconfig.compilerOptions.paths);
        json_1.writeJson(tree, 'tsconfig.base.json', Object.assign(Object.assign({}, tsconfig), { compilerOptions: Object.assign(Object.assign({}, tsconfig.compilerOptions), { paths: sortedPaths }) }));
    }
    catch (e) {
        // catch noop
    }
}
//# sourceMappingURL=format-files.js.map