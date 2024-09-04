import { getPackagesSync } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';
import { initPluginModel } from '../models/plugin';
import { Plugin } from '../plugin';

export type PluginMeta = {
  name: string;
  version: string;
  displayName: string;
  description: string;
  dependencies: Record<string, string>;
  author: string;
  serverPath: string;
  clientPath: string;
  platformType: string;
};

export class PluginManager {
  private model = initPluginModel(this.app.database.sequelize);

  private _plugins = new Map<string, PluginMeta>();
  private _instannces = new Map<string, Plugin>();

  constructor(private app: Application) {}

  get plugins() {
    return this._plugins;
  }

  async init() {
    const localPlugins = await this.getLocalPlugins();
    const installedPlugins = await this.getInstalledPlugins();
    const plugins = new Map(
      [...localPlugins, ...installedPlugins].map((p) => [p.name, p]),
    );

    this._plugins = plugins;

    for (const plugin of plugins.values()) {
      const server = await import(plugin.serverPath);
      const [exportKey] = Object.keys(server);
      const _class = server[exportKey];
      const _plugin = new _class(this.app);

      this._instannces.set(plugin.name, _plugin);
    }
  }

  async install(name: string, botId: string) {
    const plugin = this._plugins.get(name);

    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }

    const exist = await this.model.findOne({
      where: {
        name,
        botId,
      },
    });
    if (exist) {
      throw new Error(`Plugin ${name} already installed`);
    }
    return await this.model.create({
      name,
      botId,
      displayName: plugin.displayName,
      enabled: false,
      version: plugin.version,
      description: plugin.description,
      dependencies: plugin.dependencies,
      config: {},
    });
  }
  async uninstall(name: string, botId: string) {
    const exist = await this.model.findOne({
      where: {
        name,
        botId,
      },
    });
    if (!exist) {
      throw new Error(`Plugin ${name} not found`);
    }

    return await exist.destroy();
  }

  async add() {}
  async remove() {}

  async enable(name: string) {
    const plugin = await this.model.findOne({
      where: {
        name,
      },
    });
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }

    plugin.enabled = true;
    await plugin.save();
  }
  async disable(name: string) {}

  async getPlugins() {
    return Array.from(this._plugins.values());
  }

  async getLocalPlugins() {
    const packages = getPackagesSync(this.app.rootPath).filter(
      (pkg) => require(pkg.manifestLocation).botmate,
    );

    const plugins = await Promise.all(
      packages.map(async (pkg) => {
        let serverPath, clientPath;
        const botmate = pkg.get('botmate');

        if (this.app.isDev) {
          serverPath = join(pkg.location, 'src/server/index.ts');
          clientPath = join(pkg.location, 'src/client/index.ts');
        } else {
          serverPath = join(pkg.location, 'dist/server/index.js');
          clientPath = join(pkg.location, 'dist/client/index.js');
        }

        if (!existsSync(serverPath)) {
          this.app.logger.warn(
            `Plugin ${pkg.name} does not have a server entry file.`,
          );
          return;
        }

        const platformType = botmate.platformType;

        if (!platformType) {
          this.app.logger.warn(
            `Plugin ${pkg.name} does not have a platformType.`,
          );
          return;
        }

        return {
          name: pkg.name,
          displayName: pkg.get('displayName'),
          description: pkg.get('description'),
          serverPath,
          clientPath,
          author: pkg.get('author'),
          dependencies: pkg.get('dependencies'),
          version: pkg.version,
          platformType,
        } as PluginMeta;
      }),
    );
    return plugins.filter(Boolean) as PluginMeta[];
  }

  async getInstalledPlugins() {
    const pkg = require(join(this.app.rootPath, 'package.json'));
    if (pkg.dependencies) {
      // const dependencies = Object.entries(pkg.dependencies);
      // const plugins: PluginMeta[] = [];
      // for (const [name, version] of dependencies) {
      // }
    }

    return [] as PluginMeta[];
  }

  async create() {}
  async delete() {}

  async loadAll() {
    const plugins = await this.getPlugins();

    // run beforeLoad
    for (const plugin of plugins) {
      const instance = this._instannces.get(plugin.name);
      if (instance) {
        try {
          await instance.beforeLoad();
        } catch (e) {
          this.app.logger.error(
            `Error running beforeLoad for plugin ${plugin.name}`,
          );
        }
      }
    }

    // run load
    for (const plugin of plugins) {
      const instance = this._instannces.get(plugin.name);
      if (instance) {
        try {
          this.app.logger.info(`Loading plugin: ${plugin.name}`);
          await instance.load();
        } catch (e) {
          this.app.logger.error(`Error loading plugin: ${plugin.name}`);
        }
      }
    }

    // run afterLoad
    for (const plugin of plugins) {
      const instance = this._instannces.get(plugin.name);
      if (instance) {
        try {
          await instance.afterLoad();
        } catch (e) {
          this.app.logger.error(
            `Error running afterLoad for plugin ${plugin.name}`,
          );
        }
      }
    }
  }
}
