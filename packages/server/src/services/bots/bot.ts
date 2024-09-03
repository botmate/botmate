import { createLogger } from '@botmate/logger';
import { Platform, PlatformType } from '@botmate/platform';
import { existsSync } from 'fs';
import { join } from 'path';

export enum BotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

const pkgMap: Record<PlatformType, string> = {
  telegram: '@botmate/platform-telegram',
  discord: '@botmate/bot-discord',
};

export class Bot {
  enabled = false;
  status = BotStatus.INACTIVE;
  logger = createLogger({ name: Bot.name });

  constructor(
    private type: PlatformType,
    private credentials: Record<string, string>,
  ) {}

  async importPlatform() {
    const platformsDir = join(process.cwd(), 'platforms');
    if (existsSync(platformsDir)) {
      const platform = await import(
        join(platformsDir, `${this.type}/src/index.ts`)
      );
      return platform.default;
    } else {
      return (await import(pkgMap[this.type])).default;
    }
  }

  async getBotInfo() {
    try {
      const platform = await this.importPlatform();
      const bot = new platform() as Platform;
      const info = await bot.getBotInfo(this.credentials);
      return info;
    } catch (e) {
      this.logger.error(`Failed to get bot info`);
      throw e;
    }
  }

  isSupported() {}
}
