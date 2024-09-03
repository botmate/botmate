const colors = require('colors');
const { Command } = require('commander');
const { existsSync } = require('fs');
const { resolve } = require('path');
const execa = require('execa');

const start = new Command('start');

start.option('-p, --port <port>', 'port to run the server on', '3000');

start.action((opts) => {
  const { APP_PACKAGE_ROOT } = process.env;

  if (opts.port) {
    process.env.APP_PORT = opts.port;
  }

  if (!existsSync(resolve(process.cwd(), `${APP_PACKAGE_ROOT}/lib/index.js`))) {
    console.log('The code is not compiled, please execute it first');
    console.log(colors.yellow('$ pnpm build'));
    console.log('If you want to run in development mode, please execute');
    console.log(colors.yellow('$ pnpm dev'));
    return;
  }

  execa('node', [`${APP_PACKAGE_ROOT}/lib/index.js`], {
    stdio: 'inherit',
  });
});

module.exports = start;