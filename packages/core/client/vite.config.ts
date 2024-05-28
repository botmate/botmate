/// <reference types='vitest' />
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/core/client',

  plugins: [
    tsConfigPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],

  build: {
    outDir: '../../../dist/packages/core/client',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'client',
      formats: ['es'],
      fileName() {
        return 'index.js';
      },
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        sourcemap: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/.pnpm/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
});
