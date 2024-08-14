import { fixupPluginRules } from "@eslint/compat"
import jsPlugin from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import astroPlugin from "eslint-plugin-astro"
import importPlugin from "eslint-plugin-import"
import unusedImportsPlugin from "eslint-plugin-unused-imports"
import globals from "globals"

const TOOLS_FOLDER = "tools"
const COMPONENTS_FOLDER = "components"
const PAGES_FOLDER = "pages"

const RESTRICTED_PATHS_ZONES = [
  {
    target: `src/${COMPONENTS_FOLDER}`,
    from: [`src/${PAGES_FOLDER}`],
    message: "Components can't use pages.",
  },
  {
    target: `src/${TOOLS_FOLDER}`,
    from: [COMPONENTS_FOLDER, PAGES_FOLDER].map((folder) => `src/${folder}`),
    message: "Tools can't use components or pages.",
  },
]

/**
 * @type {Array<import("eslint").Linter.FlatConfig>}
 */
export default [
  {
    ignores: ["node_modules", "build", "package-lock.json"],
  },

  // ts files
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsParser,
    },
  },

  {
    settings: {
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx"],
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  ...astroPlugin.configs["flat/recommended"],
  // ...astroPlugin.configs["flat/jsx-a11y-strict"],

  // all code
  {
    plugins: {
      import: fixupPluginRules(importPlugin),
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      // js:recommended
      ...jsPlugin.configs.recommended.rules,
      "no-async-promise-executor": "off", // overrides "error"
      "no-case-declarations": "off", // overrides "error"
      "no-cond-assign": "off", // overrides "error"
      "no-extra-boolean-cast": "off", // overrides "error"
      "no-irregular-whitespace": "off", // overrides "error"
      "no-prototype-builtins": "off", // overrides "error"
      "no-useless-escape": "off", // overrides "error"
      "no-redeclare": "warn", // overrides "error"
      "no-console": "error",
      eqeqeq: ["error", "always", { null: "never" }],
      "no-warning-comments": "warn",
      "sort-imports": [
        "warn",
        {
          // don't sort imports, import/order does it
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],

      // astro
      "astro/no-set-text-directive": "error",
      // false alarm on `class:list` `:class` and `x-bind:class`
      "astro/no-unused-css-selector": "off",
      // triggers when a <label> wraps an <input> without for attribute
      "astro/jsx-a11y/label-has-associated-control": "off",
      "astro/jsx-a11y/media-has-caption": "off",

      // plugin:import
      ...importPlugin.configs.recommended.rules,
      "import/first": "error",
      "import/no-deprecated": "warn",
      "import/no-empty-named-blocks": "error",
      "import/no-mutable-exports": "error",
      "import/no-amd": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
      "import/no-webpack-loader-syntax": "error",
      "import/no-named-default": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            ["external", "builtin"],
            "internal",
            "parent",
            ["sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "~/**",
              group: "internal",
            },
          ],
        },
      ],
      "import/no-cycle": [
        "error",
        {
          allowUnsafeDynamicCyclicDependency: true,
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: RESTRICTED_PATHS_ZONES,
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["./*.ts", "./**/*.d.ts*", "./**/*.{c,m}js"],
          optionalDependencies: false,
          peerDependencies: false,
          bundledDependencies: false,
        },
      ],
      "import/no-unresolved": "off", // overrides "error"
      "import/named": "off", // overrides "error"
      "import/namespace": "off", // overrides "error"
      "import/default": "off", // overrides "error"
      "import/no-named-as-default": "off", // overrides "warn"
      "import/no-named-as-default-member": "off", // overrides "warn"
      "import/no-duplicates": "error",

      // plugin:unused-imports
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // source code
  {
    files: ["src/**/*.{js,ts,astro}"],
    rules: {
      // plugin:import
      "import/no-nodejs-modules": "error",
      "import/no-commonjs": [
        "error",
        {
          allowConditionalRequire: false,
        },
      ],
    },
  },

  // module js (browser env)
  {
    files: ["**/*.?(m){js,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // common js (node env)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
    },
  },
]
