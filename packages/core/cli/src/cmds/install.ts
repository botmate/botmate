import { Application } from '@botmate/server';
import { Command } from 'commander';

export function install(cmd: Command) {
  cmd
    .command('install')
    .argument('<name>', 'Plugin name')
    .description('Install plugins and dependencies')
    .action(async (name: string) => {
      const app = new Application();
      await app.initialize();
      await app.pluginManager.install(name);
    });
}
