import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@botmate/client'],
    },
  },
  resolve: {
    alias: {
      '@botmate/client': '../../client/src/index.ts',
    },
  },
});
