"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineTargetProjectHasE2E = exports.determineTargetProjectName = exports.sortObjectByKeys = exports.removeTSLintJSONForProject = exports.createESLintConfigForProject = exports.createRootESLintConfig = exports.setESLintProjectBasedOnProjectType = exports.visitNotIgnoredFiles = exports.addESLintTargetToProject = exports.updateWorkspaceInTree = exports.offsetFromRoot = exports.getProjectConfig = exports.isTSLintUsedInWorkspace = exports.getTargetsConfigFromProject = exports.getWorkspacePath = exports.updateJsonInTree = exports.readJsonInTree = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ignore_1 = __importDefault(require("ignore"));
const strip_json_comments_1 = __importDefault(require("strip-json-comments"));
/**
 * This method is specifically for reading JSON files in a Tree
 * @param host The host tree
 * @param path The path to the JSON file
 * @returns The JSON data in the file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJsonInTree(host, path) {
    if (!host.exists(path)) {
        throw new Error(`Cannot find ${path}`);
    }
    const contents = (0, strip_json_comments_1.default)(host.read(path).toString('utf-8'));
    try {
        return JSON.parse(contents);
    }
    catch (e) {
        throw new Error(`Cannot parse ${path}: ${e instanceof Error ? e.message : ''}`);
    }
}
exports.readJsonInTree = readJsonInTree;
/**
 * This method is specifically for updating JSON in a Tree
 * @param path Path of JSON file in the Tree
 * @param callback Manipulation of the JSON data
 * @returns A rule which updates a JSON file file in a Tree
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateJsonInTree(path, callback) {
    return (host, context) => {
        if (!host.exists(path)) {
            host.create(path, serializeJson(callback({}, context)));
            return host;
        }
        host.overwrite(path, serializeJson(callback(readJsonInTree(host, path), context)));
        return host;
    };
}
exports.updateJsonInTree = updateJsonInTree;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getWorkspacePath(host) {
    const possibleFiles = ['/workspace.json', '/angular.json', '/.angular.json'];
    return possibleFiles.filter((path) => host.exists(path))[0];
}
exports.getWorkspacePath = getWorkspacePath;
function getTargetsConfigFromProject(projectConfig) {
    if (!projectConfig) {
        return null;
    }
    if (projectConfig.architect) {
        return projectConfig.architect;
    }
    // "targets" is an undocumented but supported alias of "architect"
    if (projectConfig.targets) {
        return projectConfig.targets;
    }
    return null;
}
exports.getTargetsConfigFromProject = getTargetsConfigFromProject;
function isTSLintUsedInWorkspace(tree) {
    const workspaceJson = readJsonInTree(tree, getWorkspacePath(tree));
    if (!workspaceJson) {
        return false;
    }
    for (const [, projectConfig] of Object.entries(workspaceJson.projects)) {
        const targetsConfig = getTargetsConfigFromProject(projectConfig);
        if (!targetsConfig) {
            continue;
        }
        for (const [, targetConfig] of Object.entries(targetsConfig)) {
            if (!targetConfig) {
                continue;
            }
            if (targetConfig.builder === '@angular-devkit/build-angular:tslint') {
                // Workspace is still using TSLint, exit early
                return true;
            }
        }
    }
    // If we got this far the user has no remaining TSLint usage
    return false;
}
exports.isTSLintUsedInWorkspace = isTSLintUsedInWorkspace;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProjectConfig(host, name) {
    const workspaceJson = readJsonInTree(host, getWorkspacePath(host));
    const projectConfig = workspaceJson.projects[name];
    if (!projectConfig) {
        throw new Error(`Cannot find project '${name}'`);
    }
    else {
        return projectConfig;
    }
}
exports.getProjectConfig = getProjectConfig;
function offsetFromRoot(fullPathToSourceDir) {
    const parts = (0, core_1.normalize)(fullPathToSourceDir).split('/');
    let offset = '';
    for (let i = 0; i < parts.length; ++i) {
        offset += '../';
    }
    return offset;
}
exports.offsetFromRoot = offsetFromRoot;
function serializeJson(json) {
    return `${JSON.stringify(json, null, 2)}\n`;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateWorkspaceInTree(callback) {
    return (host, context) => {
        const path = getWorkspacePath(host);
        host.overwrite(path, serializeJson(callback(readJsonInTree(host, path), context, host)));
        return host;
    };
}
exports.updateWorkspaceInTree = updateWorkspaceInTree;
function addESLintTargetToProject(projectName, targetName) {
    return updateWorkspaceInTree((workspaceJson) => {
        const existingProjectConfig = workspaceJson.projects[projectName];
        let lintFilePatternsRoot = '';
        // Default Angular CLI project at the root of the workspace
        if (existingProjectConfig.root === '') {
            lintFilePatternsRoot = 'src';
        }
        else {
            lintFilePatternsRoot = existingProjectConfig.root;
        }
        const eslintTargetConfig = {
            builder: '@angular-eslint/builder:lint',
            options: {
                lintFilePatterns: [
                    `${lintFilePatternsRoot}/**/*.ts`,
                    `${lintFilePatternsRoot}/**/*.html`,
                ],
            },
        };
        existingProjectConfig.architect[targetName] = eslintTargetConfig;
        return workspaceJson;
    });
}
exports.addESLintTargetToProject = addESLintTargetToProject;
/**
 * Utility to act on all files in a tree that are not ignored by git.
 */
function visitNotIgnoredFiles(visitor, dir = (0, core_1.normalize)('')) {
    return (host, context) => {
        let ig;
        if (host.exists('.gitignore')) {
            ig = (0, ignore_1.default)();
            ig.add(host.read('.gitignore').toString());
        }
        function visit(_dir) {
            if (_dir && (ig === null || ig === void 0 ? void 0 : ig.ignores(_dir))) {
                return;
            }
            const dirEntry = host.getDir(_dir);
            dirEntry.subfiles.forEach((file) => {
                if (ig === null || ig === void 0 ? void 0 : ig.ignores((0, core_1.join)(_dir, file))) {
                    return;
                }
                const maybeRule = visitor((0, core_1.join)(_dir, file), host, context);
                if (maybeRule) {
                    (0, schematics_1.callRule)(maybeRule, host, context).subscribe();
                }
            });
            dirEntry.subdirs.forEach((subdir) => {
                visit((0, core_1.join)(_dir, subdir));
            });
        }
        visit(dir);
    };
}
exports.visitNotIgnoredFiles = visitNotIgnoredFiles;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function setESLintProjectBasedOnProjectType(projectRoot, projectType, hasE2e) {
    let project;
    if (projectType === 'application') {
        project = [
            `${projectRoot}/tsconfig.app.json`,
            `${projectRoot}/tsconfig.spec.json`,
        ];
        if (hasE2e) {
            project.push(`${projectRoot}/e2e/tsconfig.json`);
        }
    }
    // Libraries don't have an e2e directory
    if (projectType === 'library') {
        project = [
            `${projectRoot}/tsconfig.lib.json`,
            `${projectRoot}/tsconfig.spec.json`,
        ];
    }
    return project;
}
exports.setESLintProjectBasedOnProjectType = setESLintProjectBasedOnProjectType;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createRootESLintConfig(prefix, hasE2e) {
    let codeRules;
    if (prefix) {
        codeRules = {
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix, style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix, style: 'kebab-case' },
            ],
        };
    }
    else {
        codeRules = {};
    }
    return {
        root: true,
        ignorePatterns: ['projects/**/*'],
        overrides: [
            {
                files: ['*.ts'],
                parserOptions: {
                    project: hasE2e
                        ? ['tsconfig.json', 'e2e/tsconfig.json']
                        : ['tsconfig.json'],
                    createDefaultProgram: true,
                },
                extends: [
                    'plugin:@angular-eslint/recommended',
                    'plugin:@angular-eslint/template/process-inline-templates',
                ],
                rules: codeRules,
            },
            {
                files: ['*.html'],
                extends: ['plugin:@angular-eslint/template/recommended'],
                rules: {},
            },
        ],
    };
}
exports.createRootESLintConfig = createRootESLintConfig;
function createProjectESLintConfig(rootPath, projectRoot, projectType, prefix, hasE2e) {
    return {
        extends: `${offsetFromRoot(rootPath)}.eslintrc.json`,
        ignorePatterns: ['!**/*'],
        overrides: [
            {
                files: ['*.ts'],
                parserOptions: {
                    project: setESLintProjectBasedOnProjectType(projectRoot, projectType, hasE2e),
                    createDefaultProgram: true,
                },
                rules: {
                    '@angular-eslint/directive-selector': [
                        'error',
                        { type: 'attribute', prefix, style: 'camelCase' },
                    ],
                    '@angular-eslint/component-selector': [
                        'error',
                        { type: 'element', prefix, style: 'kebab-case' },
                    ],
                },
            },
            {
                files: ['*.html'],
                rules: {},
            },
        ],
    };
}
function createESLintConfigForProject(projectName) {
    return (tree) => {
        const angularJSON = readJsonInTree(tree, 'angular.json');
        const { root: projectRoot, projectType, prefix, } = angularJSON.projects[projectName];
        const hasE2e = determineTargetProjectHasE2E(angularJSON, projectName);
        /**
         * If the root is an empty string it must be the initial project created at the
         * root by the Angular CLI's workspace schematic
         */
        if (projectRoot === '') {
            return createRootESLintConfigFile(projectName);
        }
        return (0, schematics_1.chain)([
            // If, for whatever reason, the root .eslintrc.json doesn't exist yet, create it
            tree.exists('.eslintrc.json')
                ? () => undefined
                : createRootESLintConfigFile(projectName),
            updateJsonInTree((0, core_1.join)((0, core_1.normalize)(projectRoot), '.eslintrc.json'), () => createProjectESLintConfig(tree.root.path, projectRoot, projectType, prefix, hasE2e)),
        ]);
    };
}
exports.createESLintConfigForProject = createESLintConfigForProject;
function removeTSLintJSONForProject(projectName) {
    return (tree) => {
        const angularJSON = readJsonInTree(tree, 'angular.json');
        const { root: projectRoot } = angularJSON.projects[projectName];
        const tslintJsonPath = (0, core_1.join)((0, core_1.normalize)(projectRoot || '/'), 'tslint.json');
        if (tree.exists(tslintJsonPath)) {
            tree.delete(tslintJsonPath);
        }
    };
}
exports.removeTSLintJSONForProject = removeTSLintJSONForProject;
function createRootESLintConfigFile(projectName) {
    return (tree) => {
        var _a;
        const angularJSON = readJsonInTree(tree, getWorkspacePath(tree));
        let lintPrefix = null;
        const hasE2e = determineTargetProjectHasE2E(angularJSON, projectName);
        if ((_a = angularJSON.projects) === null || _a === void 0 ? void 0 : _a[projectName]) {
            const { prefix } = angularJSON.projects[projectName];
            lintPrefix = prefix;
        }
        return updateJsonInTree('.eslintrc.json', () => createRootESLintConfig(lintPrefix, hasE2e));
    };
}
function sortObjectByKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
        return Object.assign(Object.assign({}, result), { [key]: obj[key] });
    }, {});
}
exports.sortObjectByKeys = sortObjectByKeys;
/**
 * To make certain schematic usage conversion more ergonomic, if the user does not specify a project
 * and only has a single project in their angular.json we will just go ahead and use that one.
 */
function determineTargetProjectName(tree, maybeProject) {
    if (maybeProject) {
        return maybeProject;
    }
    const workspaceJson = readJsonInTree(tree, getWorkspacePath(tree));
    const projects = Object.keys(workspaceJson.projects);
    if (projects.length === 1) {
        return projects[0];
    }
    return null;
}
exports.determineTargetProjectName = determineTargetProjectName;
/**
 * Checking if the target project has e2e setup
 * Method will check if angular project architect has e2e configuration to determine if e2e setup
 */
function determineTargetProjectHasE2E(
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
angularJSON, projectName) {
    var _a;
    return !!((_a = getTargetsConfigFromProject(angularJSON.projects[projectName])) === null || _a === void 0 ? void 0 : _a.e2e);
}
exports.determineTargetProjectHasE2E = determineTargetProjectHasE2E;
