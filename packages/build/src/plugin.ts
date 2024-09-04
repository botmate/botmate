import react from '@vitejs/plugin-react-swc';

import { Package } from '@lerna/package';
import fg from 'fast-glob';
import { join } from 'path';
import { build as tsupBuild } from 'tsup';
import { build as viteBuild } from 'vite';

// todo: reduce code duplication [build.ts + plugin.ts]

export async function buildPlugins(packages: Package[]) {
  for (const pkg of packages) {
    console.log(`building ${pkg.name}`);

    const entry = fg.globSync(['src/server/**'], {
      cwd: pkg.location,
      absolute: true,
    });

    await tsupBuild({
      entry,
      outDir: join(pkg.location, 'lib/server'),
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

    const cwd = pkg.location;

    const cwdWin = cwd.replace(/\\/g, '/');
    const cwdUnix = cwd.replace(/\//g, '\\');

    const external = function (id: string) {
      if (
        id.startsWith('.') ||
        id.startsWith(cwdUnix) ||
        id.startsWith(cwdWin)
      ) {
        return false;
      }
      return true;
    };

    await viteBuild({
      mode: process.env.NODE_ENV || 'production',
      build: {
        minify: process.env.NODE_ENV === 'production',
        outDir: join(pkg.location, 'lib/client'),
        cssCodeSplit: true,
        emptyOutDir: true,
        lib: {
          entry: join(pkg.location, 'src/client/index.ts'),
          formats: ['es'],
          fileName: () => `index.js`,
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
}
