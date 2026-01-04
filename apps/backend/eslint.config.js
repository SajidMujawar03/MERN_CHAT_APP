import nodeConfig from '@repo/eslint-config/node';
// import globals from 'globals';

// Export the shared Node config, with backend-specific overrides
export default [
  ...nodeConfig,

  // Backend-specific: Enforce async patterns (no sync file ops), etc.
  {
    files: ['**/*.{ts,js}'],
  },
];