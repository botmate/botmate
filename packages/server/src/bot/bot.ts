import { createLogger, winston } from '@botmate/logger';
import { Platform, PlatformType } from '@botmate/platform';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';
import { BotModel, IBot } from '../models/bots.model';
import { Plugin } from '../plugin';

export enum BotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

const pkgMap: Record<PlatformType, string> = {
  telegram: '@botmate/platform-telegram',
  discord: '@botmate/platform-discord',
  slack: '@botmate/platform-slack',
};

export class Bot {
  status = BotStatus.INACTIVE;
  logger: winston.Logger = createLogger({ name: Bot.name });
  plugins = new Map<string, Plugin>();

  private _bot?: Platform;

  constructor(
    private type: PlatformType,
    private credentials: Record<string, string>,
    private _data?: IBot,
  ) {}

  instance<T>() {
    return this._bot?.instance as T;
  }

  async init(app: Application) {
    const platform = await Bot.importPlatform(this.type);
    this._bot = new platform(this.credentials) as Platform;
    await this._bot.init();
  }

  get data() {
    return this._data;
  }

  static async importPlatform(type: PlatformType) {
    const platformsDir = join(process.cwd(), 'platforms');
    if (existsSync(platformsDir)) {
      const platform = await import(join(platformsDir, `${type}/src/index.ts`));
      return platform.default?.default || platform.default;
    } else {
      const _export = await import(pkgMap[type]);
      if (_export?.default) {
        return _export.default?.default ?? _export.default;
      }
      const [first] = Object.values(_export);
      return first as Platform;
    }
  }

  async getBotInfo() {
    try {
      const platform = await Bot.importPlatform(this.type);
      const bot = new platform(this.credentials) as Platform;
      const info = await bot.getBotInfo();
      return info;
    } catch (e) {
      this.logger.error(`Failed to get bot info`);
      throw e;
    }
  }

  async start() {
    try {
      if (this._bot) {
        await this._bot.start();
        this.status = BotStatus.ACTIVE;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(`Error stopping bot: ${this.data?.id}`);
    }
  }

  async stop() {
    try {
      if (this._bot) {
        await this._bot.stop();
        this.status = BotStatus.INACTIVE;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(`Error stopping bot: ${this.data?.id}`);
    }
  }

  async restart() {
    try {
      if (this._bot) {
        await this._bot.stop();
        this.status = BotStatus.INACTIVE;

        await this._bot.start();
        this.status = BotStatus.ACTIVE;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(`Error restarting bot: ${this.data?.id}`);
    }
  }
}
