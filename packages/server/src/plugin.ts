import { createLogger } from '@botmate/logger';
import { PlatformType } from '@botmate/platform';

import { Application } from './application';
import { Bot } from './bot';

export interface PluginInterface {
  beforeLoad?: () => void;
  load: () => void;
  afterLoad?: () => void;
}

export abstract class Plugin implements PluginInterface {
  abstract displayName: string;
  abstract platformType: PlatformType;

  logger!: ReturnType<typeof createLogger>;

  async beforeLoad() {}
  async load() {}
  async afterLoad() {}

  constructor(
    private _app: Application,
    private _bot: Bot,
  ) {}

  get bot() {
    return this._bot;
  }

  get config() {
    const configManager = this._app.configManager;
    return {
      get: (key: string, def?: any) =>
        configManager.getPluginConfig(+this.bot.data.id, key, def),
      set: (key: string, value: any) =>
        configManager.savePluginConfig(+this.bot.data.id, key, value),
    };
  }
}
