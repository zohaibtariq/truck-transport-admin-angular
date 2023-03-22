declare type Options = [{
    readonly allowTwoWayDataBinding?: boolean;
}];
export declare type MessageIds = 'noDuplicateAttributes' | 'suggestRemoveAttribute';
export declare const RULE_NAME = "no-duplicate-attributes";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<MessageIds, Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
