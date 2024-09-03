export type BotInfo = {
  id: string;
  name: string;
  raw: Record<string, any>;
  avatar: string;
};

export enum PlatformType {
  Telegram = 'telegram',
  Discord = 'discord',
}

export abstract class Platform {
  abstract name: string;

  abstract getBotInfo(credentials: Record<string, string>): Promise<BotInfo>;
}
