import { Application } from '@botmate/server';
import { createLogger, isProjectRepo } from '@botmate/utils';
import { execSync } from 'child_process';
import { Command } from 'commander';
import exca from 'execa';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

function getTSConfig() {
  const tsconfig = {
    compileOnSave: false,
    compilerOptions: {
      rootDir: '.',
      sourceMap: true,
      declaration: true,
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      importHelpers: true,
      target: 'es2015',
      module: 'esnext',
      lib: ['es2020', 'dom'],
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      esModuleInterop: true,
      baseUrl: '.',
    },
    exclude: ['node_modules', 'dist'],
  };

  return tsconfig;
}

export function dev(cmd: Command) {
  cmd
    .command('dev')
    .description('Start the application in development mode')
    .option('-p, --port <port>', 'Port to listen on', '3000')
    .action(async () => {
      if (isProjectRepo()) {
        const args = ['--watch', '--tsconfig', 'tsconfig.base.json'];
        exca('tsx', [...args, 'packages/core/server/src/dev.ts'], {
          stdio: 'inherit',
        });

        exca('vite', ['dev'], {
          cwd: 'packages/core/app',
          stdio: 'inherit',
        });

        return;
      }

      const logger = createLogger('dev');

      if (!existsSync('tsconfig.json')) {
        const tsconfig = getTSConfig();
        await writeFile(
          join(process.cwd(), 'tsconfig.json'),
          JSON.stringify(tsconfig, null, 2),
        );
      }

      const botmateDir = join(process.cwd(), '.botmate');

      await mkdir(botmateDir, { recursive: true });

      await writeFile(
        join(botmateDir, 'dev.ts'),
        `import { Application } from '@botmate/server';

        async function runApp() {
          const app = new Application();
          await app.initialize();
          await app.start();
        }
        
        runApp();`,
      );

      const viteServer = await import('vite').then((m) => m.createServer);
      const react = await import('@vitejs/plugin-react').then((m) => m.default);
      const tsconfigPaths = await import('vite-tsconfig-paths').then(
        (m) => m.default,
      );

      logger.info('Building client...');

      const app = new Application();
      await app.pluginManager.initialize();
      const plugins = await app.pluginManager.getPlugins();

      const alias = new Map<string, string>();

      alias.set('@botmate/client', require.resolve('@botmate/client'));

      let pluginString = 'export const plugins = {\n';
      for (const plugin of plugins) {
        if (!plugin.clientPath) continue;

        alias.set(plugin.name, plugin.clientPath);

        pluginString += `"${plugin.name}": import("${plugin.name}"),\n`;
      }
      pluginString += '}';

      logger.debug('Writing plugins.ts');

      await writeFile(join(botmateDir, 'plugins.ts'), pluginString);
      await writeFile(
        join(botmateDir, 'main.tsx'),
        `
        ${!isProjectRepo() ? `import '@botmate/ui/style.css';` : ''}
        import * as ReactDOM from 'react-dom/client';
        import { Application } from '@botmate/client';
        
        const app = new Application();
        
        async function main() {
          const { plugins } = await import('./plugins');
          for (const name of Object.keys(plugins)) {
            try {
              const exports = await plugins[name];
              const [key] = Object.keys(exports);
              const Class = exports[key];
              await app.pluginManager.add(name, Class, app);
            } catch (error) {
              console.error(\`Failed to load plugin: \${name}\`);
              console.error(error);
            }
          }
        
          app.getRootComponent().then((rootComponent) => {
            const root = ReactDOM.createRoot(
              document.getElementById('root'),
            );
            root.render(rootComponent);
          });
        }
        main();`,
      );

      logger.debug('Writing index.html');

      writeFile(
        join(botmateDir, 'index.html'),
        `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>BotMate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <script type="module" src="main.tsx"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>`,
        'utf-8',
      );

      const args = ['--watch', '--tsconfig', 'tsconfig.json'];

      const devDeps = [];

      try {
        execSync('tsx --version');
      } catch (e) {
        devDeps.push('tsx');
      }

      await exca('pnpm', ['i', '-D', ...devDeps], {
        stdio: 'inherit',
      });

      exca('tsx', [...args, '.botmate/dev.ts'], {
        stdio: 'inherit',
        env: {
          NODE_ENV: 'development',
        },
      });

      logger.debug('Vite server...');

      const server = await viteServer({
        root: botmateDir,
        plugins: [react(), tsconfigPaths()],
        server: {
          port: 4200,
          proxy: {
            '/api': {
              target: `http://localhost:3000`,
            },
          },
        },
        resolve: {
          alias: Object.fromEntries(alias),
        },
        logLevel: 'info',
      });

      await server.listen();
    });
}
