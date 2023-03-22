"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const create_directory_1 = require("./utils/create-directory");
const eslint_utils_1 = require("./utils/eslint-utils");
async function run(options, context) {
    var _a, _b;
    const workspaceRoot = context.root;
    process.chdir(workspaceRoot);
    const projectName = context.projectName || '<???>';
    const printInfo = options.format && !options.silent;
    const reportOnlyErrors = options.quiet;
    const maxWarnings = options.maxWarnings;
    if (printInfo) {
        console.info(`\nLinting ${JSON.stringify(projectName)}...`);
    }
    const projectESLint = await (0, eslint_utils_1.loadESLint)();
    const version = (_b = (_a = projectESLint.ESLint) === null || _a === void 0 ? void 0 : _a.version) === null || _b === void 0 ? void 0 : _b.split('.');
    if (!version ||
        version.length < 2 ||
        Number(version[0]) < 7 ||
        (Number(version[0]) === 7 && Number(version[1]) < 6)) {
        throw new Error('ESLint must be version 7.6 or higher.');
    }
    const eslint = new projectESLint.ESLint({});
    /**
     * We want users to have the option of not specifying the config path, and let
     * eslint automatically resolve the `.eslintrc` files in each folder.
     */
    const eslintConfigPath = options.eslintConfig
        ? (0, path_1.resolve)(workspaceRoot, options.eslintConfig)
        : undefined;
    const lintResults = await (0, eslint_utils_1.lint)(workspaceRoot, eslintConfigPath, options);
    if (lintResults.length === 0) {
        throw new Error('Invalid lint configuration. Nothing to lint.');
    }
    const formatter = await eslint.loadFormatter(options.format);
    let totalErrors = 0;
    let totalWarnings = 0;
    // output fixes to disk, if applicable based on the options
    await projectESLint.ESLint.outputFixes(lintResults);
    /**
     * Depending on user configuration we may not want to report on all the
     * results, so we need to adjust them before formatting.
     */
    const finalLintResults = lintResults
        .map((result) => {
        totalErrors += result.errorCount;
        totalWarnings += result.warningCount;
        if (result.errorCount || (result.warningCount && !reportOnlyErrors)) {
            if (reportOnlyErrors) {
                // Collect only errors (Linter.Severity === 2)
                result.messages = result.messages.filter(({ severity }) => severity === 2);
            }
            return result;
        }
        return null;
    })
        // Filter out the null values
        .filter(Boolean);
    const hasWarningsToPrint = totalWarnings > 0 && !reportOnlyErrors;
    const hasErrorsToPrint = totalErrors > 0;
    /**
     * It's important that we format all results together so that custom
     * formatters, such as checkstyle, can provide a valid output for the
     * whole project being linted.
     *
     * Additionally, apart from when outputting to a file, we want to always
     * log (even when no results) because different formatters handled the
     * "no results" case differently.
     */
    const formattedResults = await formatter.format(finalLintResults);
    if (options.outputFile) {
        const pathToOutputFile = (0, path_1.join)(context.root, options.outputFile);
        (0, create_directory_1.createDirectory)((0, path_1.dirname)(pathToOutputFile));
        (0, fs_1.writeFileSync)(pathToOutputFile, formattedResults);
    }
    else {
        console.info(formattedResults);
    }
    if (hasWarningsToPrint && printInfo) {
        console.warn('Lint warnings found in the listed files.\n');
    }
    if (hasErrorsToPrint && printInfo) {
        console.error('Lint errors found in the listed files.\n');
    }
    if ((totalWarnings === 0 || reportOnlyErrors) &&
        totalErrors === 0 &&
        printInfo) {
        console.info('All files pass linting.\n');
    }
    const tooManyWarnings = maxWarnings >= 0 && totalWarnings > maxWarnings;
    if (tooManyWarnings && printInfo) {
        console.error(`Found ${totalWarnings} warnings, which exceeds your configured limit (${options.maxWarnings}). Either increase your maxWarnings limit or fix some of the lint warnings.`);
    }
    return {
        success: options.force || (totalErrors === 0 && !tooManyWarnings),
    };
}
exports.default = run;
