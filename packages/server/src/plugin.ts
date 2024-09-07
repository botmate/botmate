import { PlatformType } from '@botmate/platform';

import { Application } from './application';
import { Bot } from './bot';

export interface PluginInterface {
  beforeLoad?: () => void;
  load: () => void;
  afterLoad?: () => void;
}

export interface PluginOptions {}

export abstract class Plugin implements PluginInterface {
  abstract displayName: string;
  abstract platformType: PlatformType;

  async beforeLoad() {}
  async load() {}
  async afterLoad() {}

  constructor(
    private _app: Application,
    private _bot: Bot,
    private _options?: PluginOptions,
  ) {}

  get bot() {
    return this._bot;
  }
}
