/// <reference types='vitest' />
import react from '@vitejs/plugin-react';

import { existsSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const corePlugins = readdirSync(join(__dirname, '../..', 'plugins/@botmate'));

const alias = new Map<string, string>();

const packagesPath = join(__dirname, '../..');

let pluginString = '{\n';
for (const plugin of corePlugins) {
  const pkgName = `@botmate/${plugin}`;
  pluginString += `"${pkgName}": import("${pkgName}"),\n`;

  alias.set(
    pkgName,
    join(packagesPath, `plugins/@botmate/${plugin}/src/client/index.ts`),
  );
}
pluginString += '}';

if (existsSync('src'))
  writeFileSync(
    'src/plugins.ts',
    `export const plugins = ${pluginString}`,
    'utf-8',
  );

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
    watch: {
      ignored: ['packages/core/**/*'],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: Object.fromEntries(alias),
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
