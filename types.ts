import { Bot } from '@prisma/client';
import { IconType } from 'react-icons';
import { Telegram } from 'telegraf';
import { UserFromGetMe } from 'telegraf/types';

export type MenuItem = {
  label: string;
  path: string;
  icon: IconType;
  regex?: RegExp;
};

export type BotData = Bot & {
  info: UserFromGetMe;
};

export type Condition = {
  type: string;
  value: string;
};

export type InputField = {
  id: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  label: string;
  placeholder: string;
};

enum ActionCategory {
  Message = 'message',
  Chat = 'chat',
  Bot = 'bot',
  Condition = 'condition',
  Network = 'network',
}

type TelegramKeys = keyof Telegram | (string & {});

export type ActionListItem = {
  id: TelegramKeys;
  name: string;
  description: string;
  icon?: IconType;
  displayFields?: string[];
  inputs?: InputField[];
};
