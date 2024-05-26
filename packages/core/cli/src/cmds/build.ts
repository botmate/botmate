import react from '@vitejs/plugin-react';

import { Application } from '@botmate/server';
import { Command } from 'commander';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { build as viteBuild } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export function build(cmd: Command) {
  cmd
    .command('build')
    .description('Build the application')
    .action(async () => {
      const app = new Application();
      await app.initialize();

      const logger = app.logger.child({ name: 'build' });

      logger.info('Building client...');

      const plugins = await app.pluginManager.getPlugins();

      const alias = new Map<string, string>();

      alias.set('@botmate/ui', require.resolve('@botmate/ui'));
      alias.set('@botmate/client', require.resolve('@botmate/client'));

      let pluginString = 'export const plugins = {\n';
      for (const plugin of plugins) {
        if (!plugin.clientPath) continue;
        alias.set(plugin.name, plugin.clientPath);

        const pkgName = plugin.name;
        pluginString += `"${pkgName}": import("${pkgName}"),\n`;
      }
      pluginString += '}';

      app.logger.debug('Writing plugins.ts');

      await unlink('tmp/main.tsx').catch(() => null);
      await unlink('tmp/plugins.ts').catch(() => null);

      await mkdir('tmp', { recursive: true });
      await writeFile('tmp/plugins.ts', pluginString);
      await writeFile(
        'tmp/main.tsx',
        `import * as ReactDOM from 'react-dom/client';

        import { Application } from '@botmate/client';
        
        const app = new Application();
        
        async function run() {
          if (import.meta.env.DEV) {
            const { plugins } = await import('./plugins');
            for (const name of Object.keys(plugins)) {
              try {
                await app.pluginManager.add(name, plugins[name], app);
              } catch (error) {
                console.error(\`Failed to load plugin: \${name}\`);
                console.error(error);
              }
            }
          }
        
          app.getRootComponent().then((rootComponent) => {
            const root = ReactDOM.createRoot(
              document.getElementById('root') as HTMLElement,
            );
            root.render(rootComponent);
          });
        }
        run();`,
      );

      app.logger.debug('Building client...');

      await viteBuild({
        plugins: [
          react(),
          tsconfigPaths({
            root: process.cwd(),
          }),
        ],
        resolve: {
          alias: Object.fromEntries(alias),
        },
        build: {
          outDir: app.isDev
            ? 'packages/core/server/src/dist'
            : 'node_modules/@botmate/server/dist',
          sourcemap: true,
        },
      });

      logger.info('Client built');

      await unlink('tmp/main.tsx');
      await unlink('tmp/plugins.ts');
    });
}
