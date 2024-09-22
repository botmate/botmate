/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from '@botmate/logger';
import { PlatformType } from '@botmate/platform';

import { Application, IPlugin } from './application';
import { Bot } from './bot';

export interface PluginInterface {
  beforeLoad?: () => void;
  load: () => void;
  afterLoad?: () => void;
}

export abstract class Plugin<RPC = unknown> implements PluginInterface {
  abstract displayName: string;
  abstract platformType: PlatformType;
  abstract rpc: RPC;

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

  registerHook(name: string, callback: (...args: any) => void) {
    this._app.hooks.registerHook(`plugin/${this.data.name}/${name}`, callback);
  }

  invokeHook<T = unknown>(name: string, ...args: any) {
    return this._app.hooks.invoke(
      `plugin/${this.data.name}/${name}`,
      ...args,
    ) as T;
  }

  sendClientMessage(message: string, type: 'info' | 'error' = 'info') {
    return this._app.sendClientMessage(message, type);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configManager<T = Record<string, string | number | boolean>>() {
    const configManager = this._app.configManager;
    return {
      get: (key: keyof T, def?: T[keyof T]) =>
        configManager.getPluginConfig(
          this.data._id,
          key as string,
          def,
        ) as Promise<T[keyof T]>,
      set: (key: keyof T, value: T[keyof T]) =>
        configManager.savePluginConfig(this.data._id, key as string, value),
    };
  }
}
