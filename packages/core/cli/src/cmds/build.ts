import { Application } from '@botmate/server';
import { Command } from 'commander';
import { mkdir, unlink, writeFile } from 'fs/promises';

export function build(cmd: Command) {
  cmd
    .command('build')
    .description('Build the application')
    .action(async () => {
      const tsconfigPaths = await import('vite-tsconfig-paths').then(
        (m) => m.default,
      );
      const viteBuild = await import('vite').then((m) => m.build);
      const react = await import('@vitejs/plugin-react').then((m) => m.default);

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

      writeFile(
        'index.html',
        `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>BotMate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <script type="module" src="/tmp/main.tsx"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
      `,
        'utf-8',
      );

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
      await unlink('index.html');
    });
}
