import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
