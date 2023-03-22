declare type Options = [{
    maxComplexity: number;
}];
export declare type MessageIds = 'cyclomaticComplexity';
export declare const RULE_NAME = "cyclomatic-complexity";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"cyclomaticComplexity", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
