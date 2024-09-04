import type { PluginMeta } from '@botmate/server';

import { Plugin } from '../../plugin';
import { Application } from '../application';

export class PluginManager {
  constructor(private app: Application) {}

  private _instances = new Map<string, Plugin>();

  installedPlugins: PluginMeta[] = [];

  get instances() {
    return this._instances;
  }

  unloadInstances() {
    for (const [key] of this._instances.entries()) {
      this._instances.delete(key);
    }
  }

  async fetchPlugins(botId: string) {
    this.unloadInstances();
    this.installedPlugins = [];

    const allPlugins = await this.getInstalledPlugins();
    const botPlugins = await this.getBotPlugins(botId);

    for (const plugin of allPlugins) {
      if (botPlugins.some((p) => p.name === plugin.name)) {
        this.installedPlugins.push(plugin);
        await this.loadRemotePlugin(plugin);
      }
    }
  }

  async loadRemotePlugin(plugin: PluginMeta) {
    try {
      const module = await import(`${plugin.clientPath}`);
      const [first] = Object.keys(module);
      const _Plugin = module[first];
      const i = new _Plugin(this.app) as Plugin;

      this._instances.set(plugin.name, i);

      // run beforeLoad hook
      console.debug(`running beforeLoad hook for ${plugin.name}`);
      await i.beforeLoad();
    } catch (error) {
      console.error('Error loading plugin', plugin.name, error);
    }
  }

  async getInstalledPlugins() {
    const plugins = await this.app.api.get<PluginMeta[]>('/plugins');
    return plugins;
  }

  async getBotPlugins(botId: string) {
    const plugins = await this.app.api.get<PluginMeta[]>(
      `/bots/${botId}/plugins`,
    );
    return plugins;
  }

  async install(name: string) {
    try {
      const response = await fetch(`/api/plugins/install`, {
        method: 'POST',
        body: JSON.stringify({ name, botId: this.app.bot!.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {}
  }

  async uninstall(name: string) {
    try {
      const response = await fetch(`/api/plugins/uninstall`, {
        method: 'POST',
        body: JSON.stringify({ name, botId: this.app.bot!.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {}
  }

  async enable(name: string) {
    try {
      const response = await fetch(`/api/plugins/${name}/enable`, {
        method: 'POST',
      });
    } catch (e) {}
  }
  async disable(name: string) {
    try {
      const response = await fetch(`/api/plugins/${name}/disable`, {
        method: 'POST',
      });
    } catch (e) {}
  }
}
