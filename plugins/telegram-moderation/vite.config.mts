import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  // @ts-ignore
  plugins: [cssInjectedByJsPlugin()],
  build: {
    outDir: 'lib/client',
    emptyOutDir: true,
    lib: {
      entry: 'src/client/entry.ts',
      formats: ['es'],
      fileName() {
        return `index.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@botmate/client'],
    },
  },
});
