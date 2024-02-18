import { Bot } from '@prisma/client';
import { IconType } from 'react-icons';
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
