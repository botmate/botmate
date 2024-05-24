#!/usr/bin/env node
import { Command } from 'commander';

import { version } from '../package.json';
import { build } from './lib/build';
import { setup } from './lib/setup';
import { start } from './lib/start';

const cmd = new Command();
cmd.version(version);

start(cmd);
setup(cmd);
build(cmd);

cmd.parse(process.argv);
