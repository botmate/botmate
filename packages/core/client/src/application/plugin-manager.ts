import type { PluginMeta } from '@botmate/server';

import { Plugin } from '../plugin';
import { api } from './api';
import { Application } from './application';

export class PluginManager {
  plugins: PluginMeta[] = [];
  instances: Map<string, Plugin> = new Map();

  constructor(private app: Application) {}

  async initialize() {
    const plugins = await api.get<PluginMeta[]>('/plugins');
    this.plugins = plugins.data;
  }

  async add(name: string, Plugin: Plugin, app: Application) {
    try {
      // @ts-expect-error - Expected to be a constructor
      const instance = new Plugin(app);
      this.instances.set(name, instance);
    } catch (error) {
      // console.error(`Failed to add plugin: ${name}`);
      console.error(error);
    }
  }

  getInstance(pluginName: string) {
    return this.instances.get(pluginName);
  }
}
