#!/usr/bin/env node

const { Command } = require('commander');
const { version } = require('../package.json');
const { setupAppDir, initEnv } = require('../utils');

initEnv();
setupAppDir();

process.env['VITE_CJS_IGNORE_WARNING'] = 'true';

const command = new Command('botmate');

command.version(version);

require('../commands/global')(command);

command.addCommand(require('../commands/build'));
command.addCommand(require('../commands/dev'));
command.addCommand(require('../commands/start'));
command.addCommand(require('../commands/postinstall'));

command.parse(process.argv);
