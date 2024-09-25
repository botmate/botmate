// eslint-disable-next-line @nx/enforce-module-boundaries
import { Application } from '@botmate/server';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BotInfo = {
  id: string;
  name: string;
  raw: Record<string, string | any>;
  avatar: string;
};

export enum PlatformType {
  Telegram = 'telegram',
  Discord = 'discord',
  Slack = 'slack',
}

export abstract class Platform<TInstance = unknown> {
  abstract name: string;
  abstract instance: TInstance;

  abstract getBotInfo(): Promise<BotInfo>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract init(app: Application): Promise<void>;
}
