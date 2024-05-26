import react from '@vitejs/plugin-react';

import exca from 'execa';
import { existsSync, readdirSync, writeFileSync } from 'fs';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { build as viteBuild } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tscPaths from 'vite-tsconfig-paths';

async function run() {
  await unlink('tmp/main.tsx').catch(() => {});
  await unlink('tmp/plugins.ts').catch(() => {});

  const pkgsToBuild = [];
  const mainPkgs = ['client', 'server', 'cli'];

  const opts = {};
  if (opts.packages) {
    const pkgs = opts.packages.split(',');

    let found = false;
    for (const pkg of pkgs) {
      if (!mainPkgs.includes(pkg)) {
        found = true;
        break;
      }
    }

    if (found) {
      pkgsToBuild.push(pkgs);
    }
  } else {
    pkgsToBuild.push(...mainPkgs);
  }

  for (const pkg of pkgsToBuild) {
    await exca('nx', ['build', pkg], {
      stdio: 'inherit',
    });
  }

  const pluginsDir = join(process.cwd(), 'packages/plugins/@botmate');
  let plugins = await readdir(pluginsDir);

  if (opts.packages) {
    plugins = plugins.filter((p) => opts.packages.includes(p));
  }

  for (const plugin of plugins) {
    await exca('nx', ['build', plugin], {
      stdio: 'inherit',
    });

    await viteBuild({
      plugins: [tsconfigPaths()],
      build: {
        minify: false,
        sourcemap: true,
        cssCodeSplit: false,
        outDir: 'dist/packages/plugins/@botmate/' + plugin + '/client',
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@botmate/ui',
            '@botmate/client',
            '@botmate/icons',
          ],
        },
        lib: {
          name: 'index',
          entry: `packages/plugins/@botmate/${plugin}/src/client/client.ts`,
          formats: ['es'],
          fileName() {
            return `index.js`;
          },
        },
      },
      resolve: {
        // alias: {
        //   '@botmate/client': join(process.cwd(), 'packages/core/client/src'),
        //   '@botmate/ui': join(process.cwd(), 'packages/shared/ui/src'),
        //   '@botmate/icons': join(process.cwd(), 'packages/shared/icons/src'),
        // },
      },
    });
  }

  const corePlugins = readdirSync(join(__dirname, 'packages/plugins/@botmate'));

  const alias = new Map();

  const packagesPath = join(__dirname, 'packages');

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

  if (!opts.packages)
    await viteBuild({
      plugins: [react(), tscPaths()],
      resolve: {
        alias: {},
      },
      build: {
        outDir: 'dist/packages/core/server/build',
      },
    });

  await unlink('tmp/main.tsx').catch(() => {});
  await unlink('tmp/plugins.ts').catch(() => {});
}
run();
