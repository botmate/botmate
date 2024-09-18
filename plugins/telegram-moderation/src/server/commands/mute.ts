import { Plugin } from '@botmate/server';
import { Composer } from 'grammy';

export default (plugin: Plugin) => {
  const ban = new Composer();

  ban.command('mute', async (ctx) => {
    ctx.reply('Banned!');
  });

  return ban;
};
