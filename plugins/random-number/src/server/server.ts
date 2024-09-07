import { PlatformType, Plugin } from '@botmate/server';
import { Bot } from 'grammy';

export class RandomNumberGenerator extends Plugin {
  displayName = 'Random Number Generator';
  platformType = PlatformType.Telegram;

  async load() {
    const bot = this.bot.instance<Bot>();

    bot.command('random', async (ctx) => {
      const randomNumber = Math.floor(Math.random() * 100);
      await ctx.reply(`Random number: ${randomNumber}`);
    });
  }
}
