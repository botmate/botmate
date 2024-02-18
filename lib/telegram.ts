import { Telegraf } from 'telegraf';

export class Telegram {
  getBotInfo(token: string) {
    const bot = new Telegraf(token);
    return bot.telegram.getMe();
  }
}

export const telegram = new Telegram();
