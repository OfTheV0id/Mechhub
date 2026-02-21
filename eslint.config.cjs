const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

const RESTRICTED_REACT_HOOKS = [
    "useState",
    "useEffect",
    "useMemo",
    "useCallback",
    "useRef",
    "useReducer",
    "useContext",
    "useLayoutEffect",
    "useImperativeHandle",
    "useTransition",
    "useDeferredValue",
    "useId",
    "useSyncExternalStore",
    "useInsertionEffect",
];

const TS_LANGUAGE_OPTIONS = {
    parser: tsParser,
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
};

module.exports = [
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        languageOptions: TS_LANGUAGE_OPTIONS,
        rules: {
            "padding-line-between-statements": [
                "error",
                {
                    blankLine: "always",
                    prev: "function",
                    next: "function",
                },
                {
                    blankLine: "always",
                    prev: "multiline-const",
                    next: "multiline-const",
                },
                {
                    blankLine: "always",
                    prev: "*",
                    next: "return",
                },
            ],
            "no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                    maxBOF: 0,
                    maxEOF: 1,
                },
            ],
        },
    },
    {
        files: ["src/views/**/*.{ts,tsx}"],
        languageOptions: TS_LANGUAGE_OPTIONS,
        plugins: {
            "@typescript-eslint": tsPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@hooks",
                            message:
                                "Views must not import from @hooks. Pass state and handlers via props.",
                        },
                    ],
                    patterns: [
                        {
                            group: ["@hooks/*"],
                            message:
                                "Views must not import from @hooks/* directly.",
                        },
                    ],
                },
            ],
            "no-restricted-properties": [
                "error",
                ...RESTRICTED_REACT_HOOKS.map((hookName) => ({
                    object: "React",
                    property: hookName,
                    message:
                        "Views must not call React hooks directly. Move logic to presenters/hooks.",
                })),
            ],
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "ImportDeclaration[source.value='react'] ImportSpecifier[imported.name=/^use[A-Z]/]",
                    message:
                        "Views must not import hooks from React. Move logic to presenters/hooks.",
                },
                {
                    selector: "CallExpression[callee.name=/^use[A-Z]/]",
                    message:
                        "Views must not call hooks directly. Use presenter/hooks layer and pass props.",
                },
            ],
        },
    },
    {
        files: ["src/app/**/*.{ts,tsx}"],
        languageOptions: TS_LANGUAGE_OPTIONS,
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@hooks/*"],
                            message:
                                "src/app must import hooks only from @hooks root entry.",
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["src/hooks/**/*.{ts,tsx}"],
        languageOptions: TS_LANGUAGE_OPTIONS,
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "ExportSpecifier[exported.name=/^use[A-Z]/]:not([local.name=/^use[A-Z]/])",
                    message:
                        "Hooks exports must not alias non-hook symbols as hooks (for example: createX as useX).",
                },
                {
                    selector:
                        "VariableDeclarator[id.name=/^use[A-Z]/][init.type='Identifier'][init.name=/^use[A-Z].*(Query|Mutation)$/]",
                    message:
                        "Do not create compatibility aliases like useX = useXQuery/useXMutation.",
                },
            ],
        },
    },
];
