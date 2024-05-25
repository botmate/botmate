import react from '@vitejs/plugin-react';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { Command } from 'commander';
import exca from 'execa';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { build as viteBuild } from 'vite';

type BuildOptions = {
  packages?: string;
};

const mainPkgs = ['server', 'client', 'cli'];
export function build(cmd: Command) {
  cmd
    .command('build')
    .description('Build the application')
    .option('-pkgs, --packages <package>', 'Packages to build, comma separated')
    .action(async (opts: BuildOptions) => {
      const pkgsToBuild = [];
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
          plugins: [react()],
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
                '@botmate/client',
                '@botmate/ui',
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
            alias: {
              '@botmate/client': join(
                process.cwd(),
                'packages/core/client/src',
              ),
              '@botmate/ui': join(process.cwd(), 'packages/shared/ui/src'),
            },
          },
        });
      }

      if (!opts.packages)
        await viteBuild({
          plugins: [react(), nxViteTsPaths()],
          resolve: {
            alias: {
              '@botmate/ui': 'packages/shared/ui/src/index.ts',
              '@botmate/client': 'packages/core/client/src/index.ts',
            },
          },
          build: {
            outDir: 'dist/packages/core/server/build',
          },
        });
    });
}
