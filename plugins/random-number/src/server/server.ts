import { PlatformType, Plugin } from '@botmate/server';
import { Bot } from 'grammy';

export class RandomNumberGenerator extends Plugin {
  displayName = 'Random Number Generator';
  platformType = PlatformType.Telegram;

  async load() {
    const bot = this.bot.instance<Bot>();

    bot.command('random', async (ctx) => {
      const min = parseFloat(await this.config.get('min', '0'));
      const max = parseFloat(await this.config.get('max', '100'));

      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      await ctx.reply(`Random number: ${randomNumber}`);
    });
  }
}
