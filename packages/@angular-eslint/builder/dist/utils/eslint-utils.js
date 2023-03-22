"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = exports.loadESLint = void 0;
const path_1 = require("path");
async function loadESLint() {
    let eslint;
    try {
        eslint = await Promise.resolve().then(() => __importStar(require('eslint')));
        return eslint;
    }
    catch (_a) {
        throw new Error('Unable to find ESLint. Ensure ESLint is installed.');
    }
}
exports.loadESLint = loadESLint;
async function lint(workspaceRoot, eslintConfigPath, options) {
    const projectESLint = await loadESLint();
    const eslint = new projectESLint.ESLint({
        /**
         * If "noEslintrc" is set to `true` (and therefore here "useEslintrc" will be `false`), then ESLint will not
         * merge the provided config with others it finds automatically.
         */
        useEslintrc: !options.noEslintrc,
        overrideConfigFile: eslintConfigPath,
        ignorePath: options.ignorePath || undefined,
        fix: !!options.fix,
        cache: !!options.cache,
        cacheLocation: options.cacheLocation || undefined,
        cacheStrategy: options.cacheStrategy || undefined,
        resolvePluginsRelativeTo: options.resolvePluginsRelativeTo || undefined,
        rulePaths: options.rulesdir || [],
        /**
         * Default is `true` and if not overridden the eslint.lintFiles() method will throw an error
         * when no target files are found.
         *
         * We don't want ESLint to throw an error if a user has only just created
         * a project and therefore doesn't necessarily have matching files, for example.
         */
        errorOnUnmatchedPattern: false,
    });
    return await eslint.lintFiles(
    // lintFilePatterns are defined relative to the root of the Angular-CLI workspace
    options.lintFilePatterns.map((p) => (0, path_1.join)(workspaceRoot, p)));
}
exports.lint = lint;
