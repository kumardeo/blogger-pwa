/** @type {import("eslint-define-config").ESLintConfig} */
const eslintConfig = {
  env: {
    browser: false,
    node: true,
    es2022: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "airbnb-base",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier"
  ],
  settings: {
    "import/extensions": [".js", ".ts"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"]
      }
    }
  },
  rules: {
    "prettier/prettier": "warn",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never"
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["./scripts/**/*"],
        includeInternal: false,
        includeTypes: false,
        packageDir: ["."]
      }
    ]
  },
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    }
  ]
};

module.exports = eslintConfig;
