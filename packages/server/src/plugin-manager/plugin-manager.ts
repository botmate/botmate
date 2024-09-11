import { createLogger } from '@botmate/logger';
import { PlatformType } from '@botmate/platform';
import { getPackagesSync } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';
import { Bot } from '../bot';
import { initPluginModel } from '../models/plugin';

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

// todo: refactor
export class PluginManager {
  private model = initPluginModel(this.app.database.sequelize);
  private logger = createLogger({ name: PluginManager.name });

  private _plugins = new Map<string, PluginMeta>();

  constructor(private app: Application) {}

  get plugins() {
    return this._plugins;
  }

  /**
   * `init` method initializes the plugin manager by calling `beforeLoad` method of each plugin
   * and then calling `#loadAll` method to load all plugins.
   */
  async init() {
    const localPlugins = await this.getLocalPlugins();
    const plugins = new Map([...localPlugins].map((p) => [p.name, p]));

    this._plugins = plugins;

    const botsPlugins = await this.model.findAll();

    for (const botPlugin of botsPlugins) {
      const plugin = this._plugins.get(botPlugin.name);

      if (!plugin) {
        this.logger.warn(`Plugin ${botPlugin.name} is not installed`);
        continue;
      }

      if (botPlugin.enabled) {
        try {
          const botData = await this.app.botManager.get(botPlugin.botId);
          if (!botData) {
            this.logger.warn(
              `Bot ${botPlugin.botId} not found for plugin ${botPlugin.name}`,
            );
            continue;
          }

          await this.loadBotPlugin(botPlugin.name, botPlugin.botId);
        } catch (e) {
          console.error(e);
          this.logger.error(`Error loading plugin ${botPlugin.name}`);
        }
      }
    }

    await this.loadAll();
    await this.app.botManager.startAll();
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

  async loadBotPlugin(pluginName: string, botId: string) {
    const plugin = this._plugins.get(pluginName);

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    const botData = await this.app.botManager.get(botId);
    if (!botData) {
      throw new Error(`Bot ${botId} not found`);
    }

    let bot = this.app.botManager.bots.get(botData.id);

    if (!bot?.instance()) {
      try {
        this.logger.debug(`creating bot instance ${botData.id}`);
        bot = new Bot(
          botData.platformType as PlatformType,
          botData.credentials!,
          botData,
        );
        await bot.init();
        this.app.botManager.bots.set(botData.id, bot);
      } catch (e) {
        console.error(e);
        this.logger.error(`Error initializing bot ${botData.id}`);
      }
    }

    if (bot) {
      this.logger.debug(`loading plugin ${plugin.serverPath}`);

      const server = await import(plugin.serverPath);
      const [exportKey] = Object.keys(server);
      const _class = server[exportKey];

      const pluginData = await this.model.findOne({
        where: {
          name: pluginName,
          botId,
        },
      });
      const _plugin = new _class(this.app, bot, pluginData);

      _plugin.logger = createLogger({
        name: exportKey,
      });

      bot.plugins.set(plugin.name, _plugin);

      try {
        await _plugin.beforeLoad();
      } catch (error) {
        console.error(error);
        this.logger.error(`Error running beforeLoad for plugin ${pluginName}`);
      }

      try {
        await _plugin.load();
        bot.start();
      } catch (error) {
        console.error(error);
        this.logger.error(`Error loading plugin ${pluginName}`);

        bot.plugins.delete(plugin.name);
      }
    }
  }

  async loadAllBotPlugins(botId: string) {
    const plugins = await this.model.findAll({
      where: { botId },
    });
    for (const plugin of plugins) {
      await this.loadBotPlugin(plugin.name, botId);
    }
  }

  async enable(name: string, botId: string) {
    const plugin = await this.model.findOne({
      where: {
        name,
        botId,
      },
    });
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }

    plugin.enabled = true;
    await plugin.save();

    this.logger.debug(`${name} is enabled for ${botId}`);

    await this.loadBotPlugin(name, botId);
  }

  async disable(name: string, botId: string) {
    const plugin = await this.model.findOne({
      where: {
        name,
        botId,
      },
    });
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }

    const bot = await this.app.botManager.get(botId);

    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    plugin.enabled = false;
    await plugin.save();

    const instance = this.app.botManager.bots.get(plugin.botId);
    if (instance) {
      const pluginInstance = instance.plugins.get(name);
      if (pluginInstance) {
        try {
          // await pluginInstance.unload();
          instance.plugins.delete(name);
          this.logger.debug(`${name} instance deleted for ${botId}`);
        } catch (error) {
          console.error(error);
          this.logger.error(`Error unloading plugin ${name}`);
        }
      }
      this.logger.debug(`restarting instance of bot ${botId}`);
      await instance.stop();
      this.app.botManager.bots.delete(bot.id);
    }

    this.logger.debug(`${name} is disabled for bot ${botId}`);
  }

  async getPlugins(platform?: PlatformType) {
    if (platform) {
      return Array.from(this._plugins.values()).filter(
        (p) => p.platformType === platform,
      );
    }
    return Array.from(this._plugins.values());
  }

  async getBotPligins(botId: string) {
    return this.model.findAll({
      where: { botId },
    });
  }

  async get(pluginName: string) {
    return this._plugins.get(pluginName);
  }

  async getLocalPlugins() {
    const packages = getPackagesSync(this.app.rootPath).filter(
      (pkg) => require(pkg.manifestLocation).botmate,
    );

    const isDev = this.app.isDev();

    const pluginsLocal = await Promise.all(
      packages.map(async (pkg) => {
        let serverPath, clientPath;
        const botmate = pkg.get('botmate');

        if (isDev) {
          serverPath = join(pkg.location, 'src/server/index.ts');
          clientPath = join(pkg.location, 'src/client/index.ts');
        } else {
          serverPath = join(pkg.location, 'lib/server/index.js');
          clientPath = join(pkg.location, 'lib/client/index.js');
        }

        if (!existsSync(serverPath)) {
          this.logger.warn(
            `Plugin ${pkg.name} does not have a server entry file.`,
          );
          return;
        }

        const platformType = botmate.platformType;

        if (!platformType) {
          this.logger.warn(`Plugin ${pkg.name} does not have a platformType.`);
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

    const pkgJSON = join(this.app.rootPath, 'package.json');
    const deps = require(pkgJSON).dependencies || {};
    for (const dep of Object.keys(deps)) {
      try {
        const module = require(`${dep}/package.json`);
        if (module.botmate) {
          const serverPath = require.resolve(`${dep}/lib/server/index.js`);
          const clientPath = require.resolve(`${dep}/lib/client/index.js`);

          pluginsLocal.push({
            name: dep,
            displayName: module.displayName,
            description: module.description,
            serverPath,
            clientPath,
            author: module.author,
            dependencies: module.dependencies,
            version: module.version,
            platformType: module.platformType,
          });
        }
      } catch (e) {}
    }

    return pluginsLocal.filter(Boolean) as PluginMeta[];
  }

  async create() {}
  async delete() {}

  async loadAll() {
    const bots = this.app.botManager.bots;
    for (const bot of bots.values()) {
      for (const plugin of bot.plugins.values()) {
        try {
          await plugin.load();
        } catch (error) {
          console.error(error);
          this.logger.error(`Error loading plugin ${plugin.displayName}`);
        }
      }
    }
  }
}
