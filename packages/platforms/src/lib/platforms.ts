import { IconType } from 'react-icons';
import { FormInput, Platform } from '@botmate/shared';
import { FaTelegram, FaDiscord, FaSlack } from 'react-icons/fa';

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
