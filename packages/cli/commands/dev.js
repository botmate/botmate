require('colors');
const { Command } = require('commander');
const execa = require('execa');
const { existsSync } = require('fs');
const { join, dirname } = require('path');
const { createServer } = require('vite');

const dev = new Command('dev');

dev.allowUnknownOption();
dev.option('-p, --port <port>', 'port to run the server on', '8233');
dev.option('-s, --server', 'only run the server', false);

dev.action(async (opts) => {
  process.env.NODE_ENV = 'development';

  console.log('Starting development server...'.green);

  let { port, server } = opts;

  process.env.PORT = port;

  if (server) {
    process.env.NO_CLIENT = true;
  }

  const serverDir = require.resolve('@botmate/server/package.json');
  const hasTS = existsSync(join(dirname(serverDir), 'tsconfig.json'));

  if (hasTS) {
    // in a monorepo
    const tsx = join(dirname(require.resolve('tsx')), 'cli.mjs');
    const devFile = join(dirname(serverDir), 'src/dev.ts');

    const argv = [
      tsx,
      'watch',
      '--ignore=./storage/**',
      '--clear-screen=false',
      '--tsconfig tsconfig.json',
      '-r',
      'tsconfig-paths/register',
      devFile,
      'dev',
    ];

    execa('node', argv, {
      shell: true,
      stdio: 'inherit',
      env: { ...process.env },
    });
  }
});

module.exports = dev;
