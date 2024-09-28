import { PlatformType, Plugin } from '@botmate/server';
import { Bot } from 'grammy';

import { Config } from '../config.types';

export class RandomNumberGenerator extends Plugin {
  rpc: unknown;

  displayName = 'Random Number Generator';
  platformType = PlatformType.Telegram;

  async load() {
    const cm = this.configManager<Config>();
    const bot = this.bot.instance<Bot>();

    bot.command('random', async (ctx) => {
      const min = await cm.get('min', 0);
      const max = await cm.get('max', 100);

      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      await ctx.reply(`Random number: ${randomNumber}`);
    });
  }
}
