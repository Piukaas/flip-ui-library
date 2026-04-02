// @ts-check
const eslint = require("@eslint/js");
const {defineConfig} = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      // Double quotes
      "quotes": ["error", "double", {"avoidEscape": true}],

      // Spacing in imports: import { Service } from "...";
      "object-curly-spacing": ["error", "always"],

      // Consistent import style
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          "prefer": "no-type-imports"
        }
      ],

      // Allow explicit any
      "@typescript-eslint/no-explicit-any": "off",

      // Require explicit types for class properties
      "@typescript-eslint/typedef": [
        "error",
        {
          "propertyDeclaration": true,
          "memberVariableDeclaration": false
        }
      ],

      // Require explicit accessibility modifiers (private, protected, public)
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          "accessibility": "explicit",
          "overrides": {
            "constructors": "no-public"
          }
        }
      ],

      // Require readonly for properties that are never reassigned (requires type info)
      "@typescript-eslint/prefer-readonly": "error",

      // Require explicit return types on functions
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          "allowExpressions": true,
          "allowTypedFunctionExpressions": true,
          "allowHigherOrderFunctions": true,
          "allowDirectConstAssertionInArrowFunctions": true,
          "allowConciseArrowFunctionExpressionsStartingWithVoid": true
        }
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
    },
  }
]);
