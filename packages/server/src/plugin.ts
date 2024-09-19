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

  async beforeLoad() {
    this.logger.warn('beforeLoad not implemented');
  }
  async load() {
    this.logger.warn('load not implemented');
  }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configManager<T = Record<string, string | number | boolean>>() {
    const configManager = this._app.configManager;
    return {
      get: (key: keyof T, def?: T[keyof T]) =>
        configManager.getPluginConfig(
          this.data.id,
          key as string,
          def,
        ) as Promise<T[keyof T]>,
      set: (key: keyof T, value: T[keyof T]) =>
        configManager.savePluginConfig(this.data.id, key as string, value),
    };
  }
}
