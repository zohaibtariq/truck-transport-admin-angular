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
exports.RuleTester = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const path = __importStar(require("path"));
const VALID_PARSERS = [
    '@angular-eslint/template-parser',
    '@typescript-eslint/parser',
];
function getFixturesRootDir() {
    return path.join(process.cwd(), 'tests/fixtures/');
}
function isValidParser(parser) {
    return VALID_PARSERS.includes(parser);
}
class RuleTester extends experimental_utils_1.TSESLint.RuleTester {
    // as of eslint 6 you have to provide an absolute path to the parser
    // but that's not as clean to type, this saves us trying to manually enforce
    // that contributors require.resolve everything
    constructor(options) {
        var _a;
        super(Object.assign(Object.assign({}, options), { parser: require.resolve(options.parser) }));
        if ((_a = options.parserOptions) === null || _a === void 0 ? void 0 : _a.project) {
            this.filename = path.join(getFixturesRootDir(), 'file.ts');
        }
        // make sure that the parser doesn't hold onto file handles between tests
        // on linux (i.e. our CI env), there can be very a limited number of watch handles available
        afterAll(() => {
            try {
                // instead of creating a hard dependency, just use a soft require
                // a bit weird, but if they're using this tooling, it'll be installed
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(options.parser).clearCaches();
            }
            catch (_a) {
                // ignored
            }
        });
    }
    // as of eslint 6 you have to provide an absolute path to the parser
    // If you don't do that at the test level, the test will fail somewhat cryptically...
    // This is a lot more explicit
    run(name, rule, { valid, invalid }) {
        const errorMessage = `Do not set the parser at the test level unless you want to use a parser other than ${VALID_PARSERS.join(', ')}`;
        const parsedTests = {
            valid: valid.map((test) => {
                if (typeof test !== 'string' && isValidParser(test.parser)) {
                    throw Error(errorMessage);
                }
                return Object.assign(Object.assign({}, (typeof test === 'string' ? { code: test } : test)), { filename: this.filename });
            }),
            invalid: invalid.map((test) => {
                if (isValidParser(test.parser)) {
                    throw Error(errorMessage);
                }
                return Object.assign(Object.assign({}, test), { filename: this.filename });
            }),
        };
        super.run(name, rule, parsedTests);
    }
}
exports.RuleTester = RuleTester;
