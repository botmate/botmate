import { Application } from '@botmate/server';
import { Command } from 'commander';

export function install(cmd: Command) {
  cmd
    .command('install')
    .description('Install plugins and dependencies')
    .action(async () => {
      const app = new Application();
      await app.initialize();
      await app.install();
    });
}
