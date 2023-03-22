declare type Options = [{
    readonly ignoreClassNamePattern?: string;
}];
export declare type MessageIds = 'useInjectableProvidedIn' | 'suggestInjector';
export declare const RULE_NAME = "use-injectable-provided-in";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<MessageIds, Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
