declare const _default: {
    configs: {
        all: {
            extends: string;
            rules: {
                "@angular-eslint/template/accessibility-alt-text": string;
                "@angular-eslint/template/accessibility-elements-content": string;
                "@angular-eslint/template/accessibility-label-for": string;
                "@angular-eslint/template/accessibility-label-has-associated-control": string;
                "@angular-eslint/template/accessibility-table-scope": string;
                "@angular-eslint/template/accessibility-valid-aria": string;
                "@angular-eslint/template/banana-in-box": string;
                "@angular-eslint/template/click-events-have-key-events": string;
                "@angular-eslint/template/conditional-complexity": string;
                "@angular-eslint/template/cyclomatic-complexity": string;
                "@angular-eslint/template/eqeqeq": string;
                "@angular-eslint/template/i18n": string;
                "@angular-eslint/template/mouse-events-have-key-events": string;
                "@angular-eslint/template/no-any": string;
                "@angular-eslint/template/no-autofocus": string;
                "@angular-eslint/template/no-call-expression": string;
                "@angular-eslint/template/no-distracting-elements": string;
                "@angular-eslint/template/no-duplicate-attributes": string;
                "@angular-eslint/template/no-negated-async": string;
                "@angular-eslint/template/no-positive-tabindex": string;
                "@angular-eslint/template/use-track-by-function": string;
            };
        };
        base: {
            parser: string;
            plugins: string[];
        };
        recommended: {
            extends: string;
            rules: {
                "@angular-eslint/template/banana-in-box": string;
                "@angular-eslint/template/eqeqeq": string;
                "@angular-eslint/template/no-negated-async": string;
            };
        };
        'process-inline-templates': {
            parser: string;
            parserOptions: {
                ecmaVersion: number;
                sourceType: string;
            };
            plugins: string[];
            processor: string;
        };
    };
    processors: {
        'extract-inline-html': {
            preprocess: typeof import("./processors").preprocessComponentFile;
            postprocess: typeof import("./processors").postprocessComponentFile;
            supportsAutofix: boolean;
        };
    };
    rules: {
        "accessibility-alt-text": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityAltText", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "accessibility-elements-content": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityElementsContent", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "accessibility-label-for": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityLabelFor", [{
            readonly controlComponents?: readonly string[] | undefined;
            readonly labelAttributes?: readonly string[] | undefined;
            readonly labelComponents?: readonly string[] | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "accessibility-label-has-associated-control": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityLabelHasAssociatedControl", [{
            readonly controlComponents?: readonly string[] | undefined;
            readonly labelComponents?: readonly {
                readonly inputs?: readonly string[] | undefined;
                readonly selector: string;
            }[] | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "accessibility-table-scope": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"accessibilityTableScope", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "accessibility-valid-aria": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/accessibility-valid-aria").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "banana-in-box": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"bananaInBox", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "conditional-complexity": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"conditionalComplexity", [{
            maxComplexity: number;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "click-events-have-key-events": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"clickEventsHaveKeyEvents", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "cyclomatic-complexity": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"cyclomaticComplexity", [{
            maxComplexity: number;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        eqeqeq: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/eqeqeq").MessageIds, [{
            readonly allowNullOrUndefined?: boolean | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        i18n: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/i18n").MessageIds, [{
            readonly boundTextAllowedPattern?: string | undefined;
            readonly checkAttributes?: boolean | undefined;
            readonly checkDuplicateId?: boolean | undefined;
            readonly checkId?: boolean | undefined;
            readonly checkText?: boolean | undefined;
            readonly ignoreAttributes?: readonly string[] | undefined;
            readonly ignoreTags?: readonly string[] | undefined;
            readonly requireDescription?: boolean | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "mouse-events-have-key-events": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"mouseEventsHaveKeyEvents", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-any": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-any").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-autofocus": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noAutofocus", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-call-expression": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noCallExpression", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-distracting-elements": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noDistractingElements", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-duplicate-attributes": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-duplicate-attributes").MessageIds, [{
            readonly allowTwoWayDataBinding?: boolean | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-negated-async": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-negated-async").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-positive-tabindex": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-positive-tabindex").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-track-by-function": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"useTrackByFunction", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    };
};
export default _default;
