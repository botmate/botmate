const { Command } = require('commander');
const {} = require('@botmate/utils/plugin-symlink');

const postinstall = new Command('postinstall');

postinstall.action(() => {
  console.log('Installing required packages...');
});

module.exports = postinstall;
