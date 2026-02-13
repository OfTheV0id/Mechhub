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

module.exports = [
    {
        files: ["src/views/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
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
];
