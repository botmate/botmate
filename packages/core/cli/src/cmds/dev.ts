import { Command } from 'commander';
import exca from 'execa';

export function dev(cmd: Command) {
  cmd
    .command('dev')
    .description('Start the application in development mode')
    .option('-p, --port <port>', 'Port to listen on', '3000')
    .option('-w, --watch', 'Watch for changes')
    .action((opts) => {
      const args = ['--watch', '--tsconfig', 'tsconfig.base.json'];
      if (opts.watch) {
        args.push('--watch');
      }
      exca('tsx', [...args, 'packages/core/server/src/dev.ts'], {
        stdio: 'inherit',
      });
    });
}
