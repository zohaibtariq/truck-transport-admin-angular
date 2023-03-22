declare const _default: {
    configs: {
        all: {
            extends: string;
            rules: {
                "@angular-eslint/component-class-suffix": string;
                "@angular-eslint/component-max-inline-declarations": string;
                "@angular-eslint/component-selector": string;
                "@angular-eslint/contextual-decorator": string;
                "@angular-eslint/contextual-lifecycle": string;
                "@angular-eslint/directive-class-suffix": string;
                "@angular-eslint/directive-selector": string;
                "@angular-eslint/no-attribute-decorator": string;
                "@angular-eslint/no-conflicting-lifecycle": string;
                "@angular-eslint/no-empty-lifecycle-method": string;
                "@angular-eslint/no-forward-ref": string;
                "@angular-eslint/no-host-metadata-property": string;
                "@angular-eslint/no-input-prefix": string;
                "@angular-eslint/no-input-rename": string;
                "@angular-eslint/no-inputs-metadata-property": string;
                "@angular-eslint/no-lifecycle-call": string;
                "@angular-eslint/no-output-native": string;
                "@angular-eslint/no-output-on-prefix": string;
                "@angular-eslint/no-output-rename": string;
                "@angular-eslint/no-outputs-metadata-property": string;
                "@angular-eslint/no-pipe-impure": string;
                "@angular-eslint/no-queries-metadata-property": string;
                "@angular-eslint/pipe-prefix": string;
                "@angular-eslint/prefer-on-push-component-change-detection": string;
                "@angular-eslint/prefer-output-readonly": string;
                "@angular-eslint/relative-url-prefix": string;
                "@angular-eslint/sort-ngmodule-metadata-arrays": string;
                "@angular-eslint/use-component-selector": string;
                "@angular-eslint/use-component-view-encapsulation": string;
                "@angular-eslint/use-injectable-provided-in": string;
                "@angular-eslint/use-lifecycle-interface": string;
                "@angular-eslint/use-pipe-transform-interface": string;
            };
        };
        base: {
            parser: string;
            parserOptions: {
                ecmaVersion: number;
                sourceType: string;
                project: string;
            };
            plugins: string[];
        };
        recommended: {
            extends: string;
            rules: {
                "@angular-eslint/component-class-suffix": string;
                "@angular-eslint/contextual-lifecycle": string;
                "@angular-eslint/directive-class-suffix": string;
                "@angular-eslint/no-conflicting-lifecycle": string;
                "@angular-eslint/no-empty-lifecycle-method": string;
                "@angular-eslint/no-host-metadata-property": string;
                "@angular-eslint/no-input-rename": string;
                "@angular-eslint/no-inputs-metadata-property": string;
                "@angular-eslint/no-output-native": string;
                "@angular-eslint/no-output-on-prefix": string;
                "@angular-eslint/no-output-rename": string;
                "@angular-eslint/no-outputs-metadata-property": string;
                "@angular-eslint/use-lifecycle-interface": string;
                "@angular-eslint/use-pipe-transform-interface": string;
            };
        };
        "recommended--extra": {
            extends: string;
            rules: {
                "no-restricted-imports": (string | {
                    paths: {
                        name: string;
                        message: string;
                    }[];
                })[];
                "@typescript-eslint/member-ordering": (string | {
                    default: string[];
                })[];
                "no-restricted-syntax": (string | {
                    selector: string;
                    message: string;
                })[];
                "@typescript-eslint/no-inferrable-types": (string | {
                    ignoreParameters: boolean;
                })[];
                "@typescript-eslint/no-non-null-assertion": string;
                "no-fallthrough": string;
            };
        };
        "ng-cli-compat": {
            extends: string[];
            env: {
                browser: boolean;
                es6: boolean;
                node: boolean;
            };
            plugins: string[];
            rules: {
                "@typescript-eslint/interface-name-prefix": string;
                "@typescript-eslint/explicit-member-accessibility": string;
                "sort-keys": string;
                "@angular-eslint/component-class-suffix": string;
                "@angular-eslint/component-selector": (string | {
                    type: string;
                    prefix: string;
                    style: string;
                })[];
                "@angular-eslint/contextual-lifecycle": string;
                "@angular-eslint/directive-class-suffix": string;
                "@angular-eslint/directive-selector": (string | {
                    type: string;
                    prefix: string;
                    style: string;
                })[];
                "@angular-eslint/no-conflicting-lifecycle": string;
                "@angular-eslint/no-host-metadata-property": string;
                "@angular-eslint/no-input-rename": string;
                "@angular-eslint/no-inputs-metadata-property": string;
                "@angular-eslint/no-output-native": string;
                "@angular-eslint/no-output-on-prefix": string;
                "@angular-eslint/no-output-rename": string;
                "@angular-eslint/no-outputs-metadata-property": string;
                "@angular-eslint/use-lifecycle-interface": string;
                "@angular-eslint/use-pipe-transform-interface": string;
                "@typescript-eslint/adjacent-overload-signatures": string;
                "@typescript-eslint/array-type": string;
                "@typescript-eslint/ban-types": (string | {
                    types: {
                        Object: {
                            message: string;
                        };
                        Function: {
                            message: string;
                        };
                        Boolean: {
                            message: string;
                        };
                        Number: {
                            message: string;
                        };
                        String: {
                            message: string;
                        };
                        Symbol: {
                            message: string;
                        };
                    };
                })[];
                "@typescript-eslint/consistent-type-assertions": string;
                "@typescript-eslint/dot-notation": string;
                "@typescript-eslint/member-ordering": string;
                "@typescript-eslint/naming-convention": string;
                "@typescript-eslint/no-empty-function": string;
                "@typescript-eslint/no-empty-interface": string;
                "@typescript-eslint/no-explicit-any": string;
                "@typescript-eslint/no-inferrable-types": (string | {
                    ignoreParameters: boolean;
                })[];
                "@typescript-eslint/no-misused-new": string;
                "@typescript-eslint/no-namespace": string;
                "@typescript-eslint/no-non-null-assertion": string;
                "@typescript-eslint/no-parameter-properties": string;
                "@typescript-eslint/no-unused-expressions": string;
                "@typescript-eslint/no-use-before-define": string;
                "@typescript-eslint/no-var-requires": string;
                "@typescript-eslint/prefer-for-of": string;
                "@typescript-eslint/prefer-function-type": string;
                "@typescript-eslint/prefer-namespace-keyword": string;
                "@typescript-eslint/triple-slash-reference": (string | {
                    path: string;
                    types: string;
                    lib: string;
                })[];
                "@typescript-eslint/unified-signatures": string;
                complexity: string;
                "constructor-super": string;
                eqeqeq: string[];
                "guard-for-in": string;
                "id-blacklist": string[];
                "id-match": string;
                "import/no-deprecated": string;
                "jsdoc/newline-after-description": string;
                "jsdoc/no-types": string;
                "max-classes-per-file": string;
                "no-bitwise": string;
                "no-caller": string;
                "no-cond-assign": string;
                "no-console": (string | {
                    allow: string[];
                })[];
                "no-debugger": string;
                "no-empty": string;
                "no-eval": string;
                "no-fallthrough": string;
                "no-invalid-this": string;
                "no-new-wrappers": string;
                "no-restricted-imports": (string | {
                    name: string;
                    message: string;
                })[];
                "@typescript-eslint/no-shadow": (string | {
                    hoist: string;
                })[];
                "no-throw-literal": string;
                "no-undef-init": string;
                "no-underscore-dangle": string;
                "no-unsafe-finally": string;
                "no-unused-labels": string;
                "no-var": string;
                "object-shorthand": string;
                "one-var": string[];
                "prefer-arrow/prefer-arrow-functions": string;
                "prefer-const": string;
                radix: string;
                "use-isnan": string;
                "valid-typeof": string;
            };
        };
        "ng-cli-compat--formatting-add-on": {
            plugins: string[];
            rules: {
                "arrow-body-style": string;
                "arrow-parens": string;
                "comma-dangle": string;
                curly: string;
                "eol-last": string;
                "jsdoc/check-alignment": string;
                "max-len": (string | {
                    code: number;
                })[];
                "new-parens": string;
                "no-multiple-empty-lines": string;
                "no-trailing-spaces": string;
                "quote-props": string[];
                "space-before-function-paren": (string | {
                    anonymous: string;
                    asyncArrow: string;
                    named: string;
                })[];
                "@typescript-eslint/member-delimiter-style": (string | {
                    multiline: {
                        delimiter: string;
                        requireLast: boolean;
                    };
                    singleline: {
                        delimiter: string;
                        requireLast: boolean;
                    };
                })[];
                quotes: string;
                "@typescript-eslint/quotes": (string | {
                    allowTemplateLiterals: boolean;
                })[];
                "@typescript-eslint/semi": string[];
                "@typescript-eslint/type-annotation-spacing": string;
            };
        };
    };
    rules: {
        "contextual-decorator": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"contextualDecorator", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "component-class-suffix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"componentClassSuffix", [{
            suffixes: string[];
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "component-max-inline-declarations": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"componentMaxInlineDeclarations", [{
            readonly template?: number | undefined;
            readonly styles?: number | undefined;
            readonly animations?: number | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "component-selector": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/component-selector").MessageIds, import("packages/utils/src/eslint-plugin/selector-utils").Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "contextual-lifecycle": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"contextualLifecycle", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "directive-class-suffix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"directiveClassSuffix", [{
            readonly suffixes: readonly string[];
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "directive-selector": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/directive-selector").MessageIds, import("packages/utils/src/eslint-plugin/selector-utils").Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-attribute-decorator": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noAttributeDecorator", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-conflicting-lifecycle": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-conflicting-lifecycle").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-forward-ref": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noForwardRef", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-host-metadata-property": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noHostMetadataProperty", [{
            readonly allowStatic?: boolean | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-input-prefix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noInputPrefix", [{
            readonly prefixes: readonly string[];
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-input-rename": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-input-rename").MessageIds, [{
            readonly allowedNames?: readonly string[] | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-inputs-metadata-property": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noInputsMetadataProperty", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-lifecycle-call": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noLifecycleCall", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-output-native": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noOutputNative", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-output-on-prefix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noOutputOnPrefix", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-output-rename": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-output-rename").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-outputs-metadata-property": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noOutputsMetadataProperty", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-pipe-impure": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-pipe-impure").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-queries-metadata-property": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"noQueriesMetadataProperty", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "no-empty-lifecycle-method": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/no-empty-lifecycle-method").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "prefer-on-push-component-change-detection": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/prefer-on-push-component-change-detection").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "prefer-output-readonly": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/prefer-output-readonly").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "relative-url-prefix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"relativeUrlPrefix", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "sort-ngmodule-metadata-arrays": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"sortNgmoduleMetadataArrays", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-component-selector": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"useComponentSelector", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-component-view-encapsulation": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/use-component-view-encapsulation").MessageIds, [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-injectable-provided-in": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<import("./rules/use-injectable-provided-in").MessageIds, [{
            readonly ignoreClassNamePattern?: string | undefined;
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-lifecycle-interface": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"useLifecycleInterface", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "use-pipe-transform-interface": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"usePipeTransformInterface", [], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
        "pipe-prefix": import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"pipePrefix", [{
            prefixes: string[];
        }], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
    };
};
export default _default;
