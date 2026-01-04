// packages/config-eslint/base.js
// import js from '@eslint/js';
// import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'build/', '*.config.js'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      // globals: globals.es2021,  // Replaces old 'env'
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Recommended JS rules
      // ...js.configs.recommended.rules,
      // Recommended TS rules
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any":"warn",
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
        "no-console": ["error", { allow: ["warn", "error"] }]
    },
  },
];