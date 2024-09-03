import react from '@vitejs/plugin-react-swc';

import fg from 'fast-glob';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { build as tsupBuild } from 'tsup';
import { build as viteBuild } from 'vite';

import { CORE_APP, CORE_CLIENT, globExcludeFiles } from './constants';
import { buildPlugins } from './plugin';
import { getCjsPackages, getPackages, getPluginPackages } from './utils';

export async function build() {
  const packages = await getPackages();
  const cjs = getCjsPackages(packages);
  const plugins = getPluginPackages(packages);

  for (const pkg of cjs) {
    console.log('building', pkg.name);
    await buildServer(pkg.location);
  }

  if (existsSync(CORE_CLIENT)) {
    await buildClient(CORE_CLIENT);
  }

  // await buildPlugins(plugins);
}

async function buildServer(cwd: string) {
  const entry = fg.globSync(['src/**', ...globExcludeFiles], {
    cwd,
    absolute: true,
  });
  const outDir = join(cwd, 'lib');

  if (!entry.length) {
    return;
  }

  return await tsupBuild({
    entry,
    outDir,
    splitting: false,
    clean: true,
    bundle: false,
    silent: true,
    treeshake: false,
    target: 'node16',
    keepNames: true,
    format: 'cjs',
    skipNodeModulesBundle: true,
  });
}

async function buildClient(cwd: string) {
  const entry = join(cwd, 'src/index.ts');
  const cwdWin = cwd.replace(/\\/g, '/');
  const cwdUnix = cwd.replace(/\//g, '\\');
  const external = function (id: string) {
    if (id.startsWith('.') || id.startsWith(cwdUnix) || id.startsWith(cwdWin)) {
      return false;
    }
    return true;
  };
  const outDir = resolve(cwd, 'lib');

  return viteBuild({
    mode: process.env.NODE_ENV || 'production',
    build: {
      minify: process.env.NODE_ENV === 'production',
      outDir,
      cssCodeSplit: true,
      emptyOutDir: true,
      lib: {
        entry,
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
      },
      target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      rollupOptions: {
        cache: true,
        treeshake: true,
        external,
      },
    },
    plugins: [react()],
  });
}
