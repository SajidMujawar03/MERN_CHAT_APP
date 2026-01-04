
import globals from 'globals';
import reactConfig from '@repo/eslint-config/react';  // Import shared React flat config

export default [
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Base TS/React setup (shared config already includes js/ts recommended)
  ...reactConfig,

  // Vite/React Refresh (app-specific)
  // ...reactRefresh.configs.vite,

  // Additional hooks (if not in shared)
  // ...reactHooks.configs['recommended-latest'],

  // Overrides (apply last)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react-hooks/exhaustive-deps': 'off',  // Your custom
    },
  },
];