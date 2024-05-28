import { build as buildApp } from '@botmate/build';
import { Application } from '@botmate/server';
import { isProjectRepo } from '@botmate/utils';
import { Command } from 'commander';
import { join } from 'path';

export function build(cmd: Command) {
  cmd
    .command('build')
    .description('Build the application')
    .action(async () => {
      const app = new Application();
      const plugins = await app.pluginManager.getPlugins();

      const isRepo = isProjectRepo();

      buildApp({
        plugins,
        outDir: isRepo
          ? join(process.cwd(), 'packages/core/server/src/dist')
          : join(process.cwd(), 'node_modules/@botmate/server/dist'),
      });
    });
}
