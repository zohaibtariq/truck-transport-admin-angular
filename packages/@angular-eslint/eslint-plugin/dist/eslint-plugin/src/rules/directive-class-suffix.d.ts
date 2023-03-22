declare type Options = [{
    readonly suffixes: readonly string[];
}];
export declare type MessageIds = 'directiveClassSuffix';
export declare const RULE_NAME = "directive-class-suffix";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"directiveClassSuffix", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
