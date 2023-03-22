import type { TSESLint } from '@typescript-eslint/experimental-utils';
declare type Options = [
    {
        readonly boundTextAllowedPattern?: string;
        readonly checkAttributes?: boolean;
        readonly checkDuplicateId?: boolean;
        readonly checkId?: boolean;
        readonly checkText?: boolean;
        readonly ignoreAttributes?: readonly string[];
        readonly ignoreTags?: readonly string[];
        readonly requireDescription?: boolean;
    }
];
export declare type MessageIds = 'i18nAttribute' | 'i18nAttributeOnIcuOrText' | 'i18nCustomIdOnAttribute' | 'i18nCustomIdOnElement' | 'i18nDuplicateCustomId' | 'suggestAddI18nAttribute' | 'i18nMissingDescription';
export declare const RULE_NAME = "i18n";
declare const _default: TSESLint.RuleModule<MessageIds, Options, TSESLint.RuleListener>;
export default _default;
