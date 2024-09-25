import fg from 'fast-glob';
import path from 'path';
import { defineConfig } from 'tsup';

const entry = fg.globSync(['src/**/*.ts', 'src/migrations/*.{js,ts}'], {
  cwd: __dirname,
  absolute: true,
});

export default defineConfig({
  entry,
  outDir: path.join(__dirname, 'lib'),
  splitting: false,
  silent: true,
  sourcemap: false,
  clean: true,
  bundle: false,
  treeshake: true,
  skipNodeModulesBundle: true,
  dts: true,
});
