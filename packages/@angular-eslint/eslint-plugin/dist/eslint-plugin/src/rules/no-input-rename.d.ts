declare type Options = [{
    readonly allowedNames?: readonly string[];
}];
export declare type MessageIds = 'noInputRename' | 'suggestRemoveAliasName' | 'suggestReplaceOriginalNameWithAliasName';
export declare const RULE_NAME = "no-input-rename";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<MessageIds, Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
