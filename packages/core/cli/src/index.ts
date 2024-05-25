#!/usr/bin/env node
import { Command } from 'commander';

import { version } from '../package.json';
import { build } from './cmds/build';
import { install } from './cmds/install';
import { setup } from './cmds/setup';
import { start } from './cmds/start';

const cmd = new Command();
cmd.version(version);

start(cmd);
setup(cmd);
build(cmd);
install(cmd);

cmd.parse(process.argv);
