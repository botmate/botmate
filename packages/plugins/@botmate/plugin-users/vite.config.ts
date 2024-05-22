/// <reference types='vitest' />
import react from '@vitejs/plugin-react';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/packages/plugins/@botmate/users',

  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],

  build: {
    ssr: true,
    outDir: '../../../../dist/packages/plugins/@botmate/users',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: ['src/client/client.ts', 'src/server/server.ts'],
      name: 'users',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@botmate/client',
        '@botmate/server',
        '@botmate/database',
      ],
    },
  },
});
