import react from '@vitejs/plugin-react';

import { Command } from 'commander';
import exca from 'execa';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { build as viteBuild } from 'vite';

export function build(cmd: Command) {
  cmd
    .command('build')
    .description('Build the application')
    .action(async () => {
      const mainPkgs = ['server', 'client', 'cli'];
      for (const pkg of mainPkgs) {
        await exca('nx', ['build', pkg], {
          stdio: 'inherit',
        });
      }

      const pluginsDir = join(process.cwd(), 'packages/plugins/@botmate');
      const plugins = await readdir(pluginsDir);

      for (const plugin of plugins) {
        await exca('nx', ['build', plugin], {
          stdio: 'inherit',
        });

        await viteBuild({
          plugins: [react()],
          build: {
            modulePreload: false,
            target: 'esnext',
            minify: false,
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
              __federation__: join(process.cwd(), 'mock.ts'),
            },
          },
        });
      }

      // const app = new Application();
      // await app.initialize();
      // const plugins = await app.pluginManager.getPlugins();

      // const exposes = {};

      // for (const plugin of plugins) {
      //   console.log('plugin.localPath', plugin.localPath);
      //   const relativePath =
      //     plugin.localPath.replace(process.cwd(), '.') +
      //     (app.isDev ? '/src/client/client.ts' : '/client.js');
      //   exposes[plugin.name] = relativePath;
      // }

      // console.log('exposes', exposes);
      // console.log(require.resolve('@botmate/server'));
    });
}
