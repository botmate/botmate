import { PlatformType, Plugin } from '@botmate/server';
import type { Bot } from 'grammy';

export class TelegramModeration extends Plugin {
  displayName = 'Moderation';
  platformType = PlatformType.Telegram;

  async load() {
    const bot = this.bot.instance<Bot>();
  }
}
