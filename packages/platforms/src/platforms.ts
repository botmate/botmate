import d from 'debug';
import { IconType } from 'react-icons';
import { FormInput } from '@botmate/shared';
import { FaTelegram, FaDiscord, FaSlack } from 'react-icons/fa';
import { logger } from '@botmate/logger';
import { Bot as TelegramBot } from 'grammy';
import prisma from './prisma';

const debug = d('platforms');

export function platforms(): string {
  return 'platforms';
}

export const PLATFORMS: Record<
  Platform,
  {
    name: string;
    info: string;
    icon: IconType;
    inputs: FormInput[];
  }
> = {
  telegram: {
    name: 'Telegram',
    info: 'Telegram is a cloud-based instant messaging and voice over IP service.',
    icon: FaTelegram,
    inputs: [
      {
        id: 'token',
        type: 'text',
        label: 'Token',
        placeholder: 'Enter bot token',
        required: true,
      },
    ],
  },
  discord: {
    name: 'Discord',
    info: 'Discord is a VoIP, instant messaging and digital distribution platform.',
    icon: FaDiscord,
    inputs: [],
  },
  slack: {
    name: 'Slack',
    info: 'Slack is a proprietary business communication platform.',
    icon: FaSlack,
    inputs: [],
  },
} as const;

export const PLATFORMS_KEYS = ['telegram', 'discord', 'slack'] as const;
export type Platform = (typeof PLATFORMS_KEYS)[number];

export async function CreateBot(
  userId: string,
  platform: Platform,
  credentials: Record<string, string>,
) {
  debug(
    `Creating bot for ${platform} with credentials: ${JSON.stringify(credentials)}`,
  );

  switch (platform) {
    case 'telegram': {
      const bot = new TelegramBot(credentials['token']);
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

export async function GetBotByID(id: string) {
  return prisma.bot.findUnique({ where: { id } });
}
