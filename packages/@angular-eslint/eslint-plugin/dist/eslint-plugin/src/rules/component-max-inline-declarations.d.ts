declare type Options = [
    {
        readonly template?: number;
        readonly styles?: number;
        readonly animations?: number;
    }
];
export declare type MessageIds = 'componentMaxInlineDeclarations';
export declare const RULE_NAME = "component-max-inline-declarations";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"componentMaxInlineDeclarations", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
