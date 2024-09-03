import { PlatformType } from '@botmate/platform';

import { Application } from './application';

export interface PluginInterface {
  beforeLoad?: () => void;
  load: () => void;
  afterLoad?: () => void;
}

export interface PluginOptions {
  activate?: boolean;
  displayName?: string;
  description?: string;
  version?: string;
  enabled?: boolean;
  install?: (this: Plugin) => void;
  load?: (this: Plugin) => void;
  plugin?: typeof Plugin;

  [key: string]: any;
}

export abstract class Plugin implements PluginInterface {
  abstract displayName: string;
  abstract platformType: PlatformType;

  async beforeLoad() {}
  async load() {}
  async afterLoad() {}

  constructor(
    private app: Application,
    private options: PluginOptions,
  ) {}
}
