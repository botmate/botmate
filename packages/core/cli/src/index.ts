#!/usr/bin/env node
import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { build } from './cmds/build';
import { dev } from './cmds/dev';
import { install } from './cmds/install';
import { plugin } from './cmds/plugin';
import { setup } from './cmds/setup';
import { start } from './cmds/start';

const cmd = new Command();

let version = '0.0.0';

try {
  let path = join(__dirname, 'package.json');
  if (existsSync(path)) {
    const pkgJSON = readFileSync(path, 'utf-8');
    const pkg = JSON.parse(pkgJSON);
    version = pkg.version;
  } else {
    path = join(__dirname, '..', 'package.json');
    if (existsSync(path)) {
      const pkgJSON = readFileSync(path, 'utf-8');
      const pkg = JSON.parse(pkgJSON);
      version = pkg.version;
    }
  }
} catch {
  version = '0.0.0';
}

cmd.version(version);

dev(cmd);
start(cmd);
setup(cmd);
build(cmd);
install(cmd);
plugin(cmd);

cmd.parse(process.argv);
