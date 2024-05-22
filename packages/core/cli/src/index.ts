#!/usr/bin/env node
import { Command } from 'commander';

import { version } from '../package.json';
import { start } from './lib/start';

const cmd = new Command();
cmd.version(version);

start(cmd);

cmd.parse(process.argv);
