export type BotInfo = {
  id: string;
  name: string;
  raw: Record<string, any>;
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
}
