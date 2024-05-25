import { Application } from '@botmate/server';
import { Command } from 'commander';

export function start(cmd: Command) {
  cmd
    .command('start')
    .description('Start the application')
    .action(async () => {
      const app = new Application();
      await app.initialize();
      await app.start();
    });
}
