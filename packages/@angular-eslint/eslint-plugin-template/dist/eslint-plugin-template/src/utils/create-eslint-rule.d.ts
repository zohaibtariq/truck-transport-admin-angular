import type { ParseSourceSpan, TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { ESLintUtils } from '@typescript-eslint/experimental-utils';
export declare const createESLintRule: <TOptions extends readonly unknown[], TMessageIds extends string, TRuleListener extends TSESLint.RuleListener = TSESLint.RuleListener>({ name, meta, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<TOptions, TMessageIds, TRuleListener>>) => TSESLint.RuleModule<TMessageIds, TOptions, TRuleListener>;
interface ParserServices {
    convertNodeSourceSpanToLoc: (sourceSpan: ParseSourceSpan) => TSESTree.SourceLocation;
    convertElementSourceSpanToLoc: (context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>, node: TmplAstElement) => TSESTree.SourceLocation;
}
export declare function getTemplateParserServices(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>): ParserServices;
/**
 * Utility for rule authors to ensure that their rule is correctly being used with @angular-eslint/template-parser
 * If @angular-eslint/template-parser is not the configured parser when the function is invoked it will throw
 */
export declare function ensureTemplateParser(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>): void;
export {};
