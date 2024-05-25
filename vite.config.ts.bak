import react from '@vitejs/plugin-react';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nxViteTsPaths()],
  resolve: {
    alias: {
      '@botmate/ui': 'packages/shared/ui/src/index.ts',
      '@botmate/client': 'packages/core/client/src/index.ts',
    },
  },
});
