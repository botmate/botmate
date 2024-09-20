const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { dirname, join } = require('path');

process.env['VITE_CJS_IGNORE_WARNING'] = 'true';

const tsConfigPath = join(__dirname, '..', 'tsconfig.json');
const isTsProject = existsSync(tsConfigPath);

const tsx = join(dirname(require.resolve('tsx')), 'cli.mjs');

function run() {
  let watchMode = false;

  const [, , ...argv] = process.argv;

  const [cmd] = argv;

  if (cmd === 'dev') {
    watchMode = true;
  }

  if (isTsProject) {
    process.env.IS_MONOREPO = 'true';
    process.env.NODE_ENV = 'development';

    const cliPath = join(__dirname, '..', 'src', 'cli.ts');

    spawn(
      tsx,
      [
        ...(watchMode ? ['watch', '--ignore=./storage/**'] : []),
        '-r',
        'tsconfig-paths/register',
        cliPath,
        ...argv,
      ],
      {
        stdio: 'inherit',
      },
    );
  } else {
    const cliPath = join(__dirname, '..', 'lib', 'cli.js');
    const [, , ...argv] = process.argv;

    if (watchMode) {
      process.env.NODE_ENV = 'development';
      spawn(
        tsx,
        [
          'watch',
          '--ignore=./storage/**',
          '-r',
          'tsconfig-paths/register',
          cliPath,
          ...argv,
        ],
        {
          stdio: 'inherit',
        },
      );
      return;
    }

    spawn('node', [cliPath, ...argv], {
      stdio: 'inherit',
    });
  }
}

run();
