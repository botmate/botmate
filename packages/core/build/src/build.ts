import type { PluginMeta } from '@botmate/server';
import { isProjectRepo } from '@botmate/utils';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { createTmpDir, logger } from './utils';

interface BuildOptions {
  plugins: PluginMeta[];
  outDir: string;
}

export async function build({ plugins, outDir }: BuildOptions) {
  logger.debug('Our Dir: ' + outDir);

  const viteBuild = await import('vite').then((m) => m.build);
  const react = await import('@vitejs/plugin-react').then((m) => m.default);
  const tsconfigPaths = await import('vite-tsconfig-paths').then(
    (m) => m.default,
  );

  logger.info('Building client...');

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

  const { tmpDir, cleanup } = await createTmpDir();

  await writeFile(join(tmpDir, 'plugins.ts'), pluginString);
  await writeFile(
    join(tmpDir, 'main.tsx'),
    `
    ${!isProjectRepo() ? `import '@botmate/ui';` : ''}
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
    join(tmpDir, 'index.html'),
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

  logger.debug('Vite build...');

  await viteBuild({
    root: tmpDir,
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: Object.fromEntries(alias),
    },
    build: {
      outDir,
      rollupOptions: {
        input: {
          app: join(tmpDir, 'index.html'),
        },
      },
    },
    logLevel: 'error',
  });

  await cleanup();

  logger.info('Client built successfully!');
}
