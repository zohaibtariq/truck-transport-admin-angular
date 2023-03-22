declare type Options = [
    {
        readonly controlComponents?: readonly string[];
        readonly labelAttributes?: readonly string[];
        readonly labelComponents?: readonly string[];
    }
];
export declare type MessageIds = 'accessibilityLabelFor';
export declare const RULE_NAME = "accessibility-label-for";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityLabelFor", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
