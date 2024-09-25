import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      entryRoot: 'src/index.ts',
    }),
  ],
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    lib: {
      entry: 'src/entry.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@botmate/ui',
        'lucide-react',
      ],
    },
  },
});
