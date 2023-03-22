declare type LabelComponent = {
    readonly inputs?: readonly string[];
    readonly selector: string;
};
declare type Options = [
    {
        readonly controlComponents?: readonly string[];
        readonly labelComponents?: readonly LabelComponent[];
    }
];
export declare type MessageIds = 'accessibilityLabelHasAssociatedControl';
export declare const RULE_NAME = "accessibility-label-has-associated-control";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityLabelHasAssociatedControl", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
