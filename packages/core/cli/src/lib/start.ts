import { Command } from 'commander';

export function start(cmd: Command) {
  cmd
    .command('start')
    .description('Start the application')
    .option('-p, --port <port>', 'Port to listen on', '3000')
    .action((options) => {
      console.log('Starting application on port', options.port);
    });
}
