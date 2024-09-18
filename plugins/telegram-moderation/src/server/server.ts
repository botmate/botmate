import { PlatformType, Plugin } from '@botmate/server';
import type { Bot } from 'grammy';

import ban from './commands/ban';
import kick from './commands/kick';
import mute from './commands/mute';

export class TelegramModeration extends Plugin {
  displayName = 'Telegram Moderation';
  platformType = PlatformType.Telegram;

  async load() {
    const bot = this.bot.instance<Bot>();

    [ban, kick, mute].forEach((command) => {
      const composer = command(this);
      bot.use(composer);
    });
  }
}
