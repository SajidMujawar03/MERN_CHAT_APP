import frontendConfig from './apps/frontend/eslint.config.js';
import backendConfig from './apps/backend/eslint.config.js';

// A small root config that brings together the workspace-specific configs
export default [
  // ignore the workspace node_modules
  {
    ignores: ['**/node_modules/**'],
  },

  // Spread in each package's flat config so that eslint has something to run
  ...frontendConfig,
  ...backendConfig,
];
