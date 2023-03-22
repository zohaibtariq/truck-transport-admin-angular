declare type Options = [{
    readonly prefixes: readonly string[];
}];
export declare type MessageIds = 'noInputPrefix';
export declare const RULE_NAME = "no-input-prefix";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noInputPrefix", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
