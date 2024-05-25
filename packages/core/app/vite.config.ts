/// <reference types='vitest' />
import react from '@vitejs/plugin-react';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/core/app',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    federation({
      name: 'app',
      remotes: {
        remoteApp: 'http://localhost:3000/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],

  resolve: {
    alias: {
      '@botmate/ui': 'packages/shared/ui/src/index.ts',
      '@botmate/client': 'packages/core/client/src/index.ts',
    },
  },

  build: {
    target: 'esnext',
    modulePreload: false,
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['packages/core'],
    },
  },
});
