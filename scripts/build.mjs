import exca from 'execa';
import { readdirSync, writeFileSync } from 'fs';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { build as viteBuild } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

async function run() {
  const opts = {};

  await unlink('tmp/main.tsx').catch(() => {});
  await unlink('tmp/plugins.ts').catch(() => {});

  const pkgsToBuild = [];
  const mainPkgs = ['client', 'server', 'cli'];

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
      resolve: {},
    });
  }

  const corePlugins = readdirSync(
    join(process.cwd(), 'packages/plugins/@botmate'),
  );

  const alias = new Map();

  const packagesPath = join(process.cwd(), 'packages');

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

  writeFileSync(
    'tmp/plugins.ts',
    `export const plugins = ${pluginString}`,
    'utf-8',
  );

  writeFileSync(
    'tmp/main.tsx',
    `import * as ReactDOM from 'react-dom/client';

      import { Application } from '@botmate/client';

      const app = new Application();

      async function run() {
        const { plugins } = await import('./plugins');
        for (const name of Object.keys(plugins)) {
          try {
            await app.pluginManager.add(name, plugins[name], app);
          } catch (error) {
            console.error(\`Failed to load plugin: \${name}\`);
            console.error(error);
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

  await unlink('tmp/main.tsx').catch(() => {});
  await unlink('tmp/plugins.ts').catch(() => {});
}
run();
