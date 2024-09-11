import { createLogger } from '@botmate/logger';
import { PlatformType } from '@botmate/platform';

import { Application } from './application';
import { Bot } from './bot';
import { IPlugin } from './models/plugin';

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
    private _data: IPlugin,
  ) {}

  get bot() {
    return this._bot;
  }

  get data() {
    return this._data;
  }

  get config() {
    const configManager = this._app.configManager;
    return {
      get: (key: string, def?: any) =>
        configManager.getPluginConfig(this.data.id, key, def),
      set: (key: string, value: any) =>
        configManager.savePluginConfig(this.data.id, key, value),
    };
  }
}
