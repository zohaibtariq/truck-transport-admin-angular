declare type Options = [
    {
        prefixes: string[];
    }
];
export declare type MessageIds = 'pipePrefix';
export declare const RULE_NAME = "pipe-prefix";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"pipePrefix", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
