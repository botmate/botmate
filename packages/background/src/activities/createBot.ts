import { Bot as TelegramBot } from 'grammy';

import { Bot } from '@prisma/client';
import prisma from '../lib/prisma';
import { Platform } from '@botmate/shared';

type CreateBotInput = {
  platform: Platform;
  userId: string;
  credentials: Record<string, string>;
};
export async function createBot({
  platform,
  userId,
  credentials,
}: CreateBotInput): Promise<Bot> {
  switch (platform) {
    case 'telegram': {
      const bot = new TelegramBot(credentials.token);
      const me = await bot.api.getMe();
      const botData = await prisma.bot.create({
        data: {
          userId,
          platform,
          credentials,
          id: me.id.toString(),
          info: me as never,
          name: me.first_name,
        },
      });
      return botData;
    }
  }

  throw new Error('Platform not supported');
}
