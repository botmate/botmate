const { Command } = require('commander');
const { join } = require('path');
const execa = require('execa');

/**
 *
 * @param {Command} cli
 */
module.exports = function (cli) {
  cli
    .allowUnknownOption()
    .option('-h, --help', 'output usage information')
    .action(() => {
      try {
        const appPackagePath = require.resolve('@botmate/app/src/index.ts');
        const argv = [
          join(__dirname, '../node_modules/tsx/dist/cli.mjs'),
          'watch',
          '--ignore=./storage/plugins/**',
          '--tsconfig tsconfig.json',
          '-r',
          'tsconfig-paths/register',
          appPackagePath,
          process.argv.slice(2).join(' '),
        ];

        execa('node', argv, {
          shell: true,
          stdio: 'inherit',
          env: {
            ...process.env,
          },
        });
      } catch (e) {
        console.log('e', e);
        console.error('Botmate is not installed in this project.');
        console.log('Please run `yarn add @botmate/cli` to install botmate.');
      }
    });
};
