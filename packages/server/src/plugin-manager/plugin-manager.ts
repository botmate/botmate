import { getPackagesSync } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';
import { initPluginModel } from '../models/plugin';
import { Plugin } from '../plugin';

type PluginMeta = {
  name: string;
  displayName: string;
  serverPath: string;
  clientPath: string;
  version: string;
  loaded: boolean;
};

export class PluginManager {
  private plugins: PluginMeta[] = [];
  private pluginInstances = new Map<string, Plugin>();

  constructor(private app: Application) {}

  async install() {}
  async uninstall() {}

  async add() {}
  async remove() {}

  async enable() {}
  async disable() {}

  async getPlugins() {
    const localPlugins = await this.getLocalPlugins();
    const installedPlugins = await this.getInstalledPlugins();

    return [...localPlugins, ...installedPlugins];
  }

  async getLocalPlugins() {
    const pluginModel = initPluginModel(this.app.database.sequelize);
    const packages = getPackagesSync(this.app.rootPath).filter(
      (pkg) => require(pkg.manifestLocation).botmate
    );

    const plugins = await Promise.all(
      packages.map(async (pkg) => {
        let serverPath, clientPath;
        if (this.app.isDev) {
          serverPath = join(pkg.location, 'src/server/index.ts');
          clientPath = join(pkg.location, 'src/client/index.ts');
        } else {
          serverPath = join(pkg.location, 'dist/server/index.js');
          clientPath = join(pkg.location, 'dist/client/index.js');
        }
        if (!existsSync(serverPath)) {
          this.app.logger.warn(
            `Plugin ${pkg.name} does not have a server entry file.`
          );
          return;
        }

        try {
          const server = await import(serverPath);
          const [exportKey] = Object.keys(server);
          const _class = server[exportKey];
          const plugin = new _class(this.app);
          this.pluginInstances.set(pkg.name, plugin);

          const exist = await pluginModel.findOne({
            where: { name: pkg.name }
          });

          if (!exist) {
            await pluginModel.create({
              name: pkg.name,
              displayName: pkg.get('displayName'),
              version: pkg.version,
              enabled: false,
              installed: true,
              description: pkg.get('description'),
              options: {},
              dependencies: {}
            });
          }

          return {
            name: pkg.name,
            displayName: pkg.get('displayName'),
            serverPath,
            clientPath,
            loaded: false,
            version: pkg.version
          } as PluginMeta;
        } catch {
          this.app.logger.warn(`Plugin ${pkg.name} does not have an export.`);
        }
      })
    );
    return plugins.filter(Boolean) as PluginMeta[];
  }

  async getInstalledPlugins() {
    const pkg = require(join(this.app.rootPath, 'package.json'));
    if (pkg.dependencies) {
      const dependencies = Object.entries(pkg.dependencies);
      const plugins: PluginMeta[] = [];
      for (const [name, version] of dependencies) {
      }
    }

    return [] as PluginMeta[];
  }

  async create() {}
  async delete() {}

  async loadAll() {
    const plugins = await this.getPlugins();

    // run beforeLoad
    for (const plugin of plugins) {
      const instance = this.pluginInstances.get(plugin.name);
      if (instance) {
        try {
          await instance.beforeLoad();
        } catch (e) {
          this.app.logger.error(
            `Error running beforeLoad for plugin ${plugin.name}`
          );
        }
      }
    }

    // run load
    for (const plugin of plugins) {
      const instance = this.pluginInstances.get(plugin.name);
      if (instance) {
        try {
          await instance.load();
          plugin.loaded = true;
        } catch (e) {
          this.app.logger.error(`Error loading plugin ${plugin.name}`);
        }
      }
    }

    // run afterLoad
    for (const plugin of plugins) {
      const instance = this.pluginInstances.get(plugin.name);
      if (instance) {
        try {
          await instance.afterLoad();
        } catch (e) {
          this.app.logger.error(
            `Error running afterLoad for plugin ${plugin.name}`
          );
        }
      }
    }
  }
}
