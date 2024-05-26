import react from '@vitejs/plugin-react';

import { Application } from '@botmate/server';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import { build as viteBuild } from 'vite';

type BuildOptions = {
  name: string;
};

export function install(cmd: Command) {
  cmd
    .command('install')
    .argument('<name>', 'Plugin name')
    .description('Install plugins and dependencies')
    .action(async (name: string) => {
      const app = new Application();
      await app.initialize();

      await app.pluginManager.install(name);

      // await app.install();

      // console.log('Building client...');

      // const plugins = await app.pluginManager.getPlugins();

      // const alias = new Map<string, string>();

      // alias.set('@botmate/ui', require.resolve('@botmate/ui'));
      // alias.set('@botmate/client', require.resolve('@botmate/client'));

      // for (const plugin of plugins) {
      //   if (!plugin.clientPath) continue;
      //   alias.set(plugin.name, plugin.clientPath);
      // }

      // const pluginsTsx = plugins
      //   .map((p) => `export * from '${p.name}';`)
      //   .join('\n');

      // writeFileSync('tmp/plugins.ts', pluginsTsx);
      // writeFileSync(
      //   'tmp/main.tsx',
      //   `import * as ReactDOM from 'react-dom/client';
      //   import { Application } from '@botmate/client';

      //   const app = new Application();

      //   async function run() {
      //     const plugins = await import('./plugins');
      //     for (const name of Object.keys(plugins)) {
      //       console.log(\`Loading plugin: \${name}\`);
      //       try {
      //         await app.addPlugin(plugins[name], name);
      //       } catch (error) {
      //         console.error(\`Failed to load plugin: \${name}\`);
      //         console.error(error);
      //       }
      //     }
      //     app.getRootComponent().then((rootComponent) => {
      //       const root = ReactDOM.createRoot(
      //         document.getElementById('root') as HTMLElement,
      //       );
      //       root.render(rootComponent);
      //     });
      //   }
      //   run();`,
      // );

      // await viteBuild({
      //   plugins: [react(), nxViteTsPaths()],
      //   resolve: {
      //     alias: Object.fromEntries(alias),
      //   },
      //   build: {
      //     outDir: 'packages/core/server/src/dist',
      //   },
      // });
    });
}
