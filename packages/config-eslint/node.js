// packages/config-eslint/node.js
import base from './base.js';
import n from 'eslint-plugin-n';

export default [
  ...base,

  // Node-specific
  {
    files: ['**/*.{js,ts}'],  // Non-React files
    languageOptions: {
      // globals: globals.node,  // Import globals from 'globals' if not in base
    },
    plugins: {
      n,
    },
    rules: {
      ...n.configs.recommended.rules,
      "n/no-process-exit": "warn"
    },
  },
];