// packages/config-eslint/react.js
import base from './base.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
// import globals from 'globals';

export default [
  ...base,
  {
    files: ['**/*.{jsx,tsx}'],  // Only JSX/TSX for React rules
    languageOptions: {
      globals: {
        // ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
];