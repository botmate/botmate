import { Application } from '@botmate/server';
import { Command } from 'commander';

export function setup(cmd: Command) {
  cmd
    .command('setup')
    .description('Setup the application')
    .action(async () => {
      const app = new Application();
      await app.initialize();
      await app.pluginManager.setup();
    });
}
