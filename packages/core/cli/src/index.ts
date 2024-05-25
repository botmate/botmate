#!/usr/bin/env node
import { env } from '@botmate/utils';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

import { build } from './cmds/build';
import { dev } from './cmds/dev';
import { install } from './cmds/install';
import { setup } from './cmds/setup';
import { start } from './cmds/start';

const cmd = new Command();

let version = '0.0.0';

function setVersion(path: string) {
  const pkgJSON = readFileSync(path, 'utf-8');
  const pkg = JSON.parse(pkgJSON);
  version = pkg.version;
}

if (env.NODE_ENV === 'development') {
  setVersion(join(__dirname, '..', 'package.json'));
} else {
  setVersion(join(__dirname, 'package.json'));
}

cmd.version(version);

dev(cmd);
start(cmd);
setup(cmd);
build(cmd);
install(cmd);

cmd.parse(process.argv);
