import type { IPlugin } from '@botmate/server';

import { Plugin } from '../plugin';
import { api } from './api';
import { Application } from './application';

export class PluginManager {
  plugins: IPlugin[] = [];

  constructor(private app: Application) {}

  async initialize() {
    const plugins = await api.get<IPlugin[]>('/plugins');
    this.plugins = plugins.data;
  }

  async add(Plugin: Plugin, app: Application) {
    // @ts-expect-error - Expected to be a constructor
    const instance = new Plugin(app);
    instance.beforeLoad();
  }
}
