#!/usr/bin/env node

const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { dirname, join } = require('path');

process.env['VITE_CJS_IGNORE_WARNING'] = 'true';

const tsConfigPath = join(__dirname, '..', 'tsconfig.json');
const isTsProject = existsSync(tsConfigPath);

const tsx = join(dirname(require.resolve('tsx')), 'cli.mjs');

function run() {
  if (isTsProject) {
    process.env.IS_MONOREPO = 'true';
    process.env.NODE_ENV = 'development';

    const cliPath = join(__dirname, '..', 'src', 'cli.ts');
    const [, , ...argv] = process.argv;

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
  } else {
    const cliPath = join(__dirname, '..', 'lib', 'cli.js');
    const [, , ...argv] = process.argv;

    if (argv.length > 0) {
      const [cmd] = argv;
      if (cmd === 'dev') {
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
    }

    spawn('node', [cliPath, ...argv], {
      stdio: 'inherit',
    });
  }
}

run();
