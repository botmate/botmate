const { Command } = require('commander');
const execa = require('execa');
const { join } = require('path');
const { existsSync } = require('fs');

const build = new Command('build');

build.arguments('[packages...]');

build.action(async () => {
  if (existsSync(join(process.cwd(), 'packages/build'))) {
    await execa('pnpm build', {
      stdio: 'inherit',
      shell: true,
      cwd: join(process.cwd(), 'packages/build'),
    });
  }

  await execa('botmate-build', {
    stdio: 'inherit',
    shell: true,
  });
});

module.exports = build;
