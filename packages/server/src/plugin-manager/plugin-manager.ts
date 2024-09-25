/* eslint-disable @typescript-eslint/no-var-requires */
import { createLogger, winston } from '@botmate/logger';
import { PlatformType } from '@botmate/platform';
import { getPackagesSync } from '@lerna/project';
import colors from 'colors';
import execa from 'execa';
import { existsSync } from 'fs';
import { nanoid } from 'nanoid';
import { join } from 'path';

import { Application } from '../application';
import { Bot } from '../bot';
import { PluginModel } from '../models/plugins.model';

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
  private logger: winston.Logger = createLogger({ name: PluginManager.name });

  /**
   * Map of plugins with plugin name as key and plugin meta as value.
   * @internal
   */
  private _plugins = new Map<string, PluginMeta>();

  constructor(private app: Application) {
    // PluginModel = initPluginModel(this.app.database.sequelize);
  }

  /**
   * Returns the map of local plugins
   */
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

    const botsPlugins = await PluginModel.find();

    this.logger.debug('Initializing plugins...');

    for (const botPlugin of botsPlugins) {
      const plugin = this._plugins.get(botPlugin.name);

      if (!plugin) {
        this.logger.warn(`Plugin ${botPlugin.name} is not installed`);
        continue;
      }

      if (botPlugin.enabled) {
        try {
          const botData = await this.app.botManager.findById(botPlugin.botId);
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

    const totalBots = await this.app.botManager.startAll();

    this.app.logger.debug(
      `found:\n\t${colors.bold(localPlugins.length + '').yellow} plugins\n\t${
        colors.bold(totalBots + '').yellow
      } bots`,
    );
  }

  async install(name: string, botId: string) {
    const plugin = this._plugins.get(name);

    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    const exist = await PluginModel.countDocuments({
      name,
      botId,
    });
    if (exist > 0) {
      throw new Error(`Plugin ${name} already installed`);
    }
    return await PluginModel.create({
      id: nanoid(),
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
    const exist = await PluginModel.findOne({
      name,
      botId,
    });
    if (!exist) {
      throw new Error(`Plugin ${name} not found`);
    }

    const bot = this.app.botManager.bots.get(botId);
    if (bot) {
      try {
        await this.disable(name, botId);
      } catch (error) {
        console.error(error);
        this.logger.error(`Error unloading plugin ${name}`);
      }
    }

    await exist.deleteOne();
  }

  /**
   * Loads a plugin for a bot and initializes the plugin instance.
   * @param pluginName
   * @param botId
   */
  async loadBotPlugin(pluginName: string, botId: string) {
    const plugin = this._plugins.get(pluginName);

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    const botData = await this.app.botManager.findById(botId);
    if (!botData) {
      throw new Error(`Bot ${botId} not found`);
    }

    let bot = this.app.botManager.bots.get(botData.id);

    if (!bot?.instance()) {
      try {
        this.logger.debug(`creating bot instance ${botData.id}`);
        bot = new Bot(
          botData.platformType as PlatformType,
          botData.credentials as Record<string, string>,
          botData,
        );
        await bot.init(this.app);
        this.app.botManager.bots.set(botData.id, bot);
      } catch (e) {
        console.error(e);
        this.logger.error(`Error initializing bot ${botData.id}`);
      }
    }

    if (bot) {
      this.logger.debug(`loading plugin ${plugin.serverPath}`);

      const server = require(plugin.serverPath);
      const [exportKey] = Object.keys(server);
      const _class = server[exportKey];

      const pluginData = await PluginModel.findOne({
        name: pluginName,
        botId,
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
    const plugins = await PluginModel.find({
      botId,
    });
    for (const plugin of plugins) {
      await this.loadBotPlugin(plugin.name, botId);
    }
  }

  async enable(name: string, botId: string) {
    const plugin = await PluginModel.findOne({
      name,
      botId,
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
    const plugin = await PluginModel.findOne({
      name,
      botId,
    });
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }

    const bot = await this.app.botManager.findById(botId);
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
    return PluginModel.find({
      botId,
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

    const pluginsLocal = (await Promise.all(
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
    ).then((plugins) => plugins.filter(Boolean))) as PluginMeta[];

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
            platformType: module.botmate.platformType,
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.stack?.includes('ERR_PACKAGE_PATH_NOT_EXPORTED')) {
            continue;
          }
        }
        console.error(e);
        this.logger.error(`Error loading plugin ${dep}`);
      }
    }

    return pluginsLocal.filter(Boolean) as PluginMeta[];
  }

  async create() {
    throw new Error('Method not implemented.');
  }
  async delete() {
    throw new Error('Method not implemented.');
  }

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

  async installFromNpm(pkgName: string, botId: string) {
    try {
      this.logger.debug(`Installing ${pkgName} in ${this.app.rootPath}`);

      this.app.setMaintenanceMode(
        'Installing plugin...',
        'Please wait while the plugin is being installed',
      );

      if (this._plugins.has(pkgName)) {
        this.app.sendClientMessage(
          `Plugin ${pkgName} already installed`,
          'error',
        );
        this.logger.warn(`Plugin ${pkgName} already installed`);
        return;
      }

      const buffer = execa('pnpm', ['add', pkgName], {
        cwd: this.app.rootPath,
      });

      if (buffer.stdout)
        for await (const chunk of buffer.stdout) {
          this.app.setMaintenanceMode('Installing plugin...', chunk.toString());
        }

      this.logger.debug(`Installed ${pkgName}`);

      try {
        this.app.setMaintenanceMode(
          'Loading plugin...',
          'Please wait while the plugin is being loaded',
        );

        this.logger.debug(`Loading ${pkgName}`);
        const module = require(`${pkgName}/package.json`);
        if (module.botmate) {
          const serverPath = require.resolve(`${pkgName}/lib/server/index.js`);
          const clientPath = require.resolve(`${pkgName}/lib/client/index.js`);

          this.plugins.set(pkgName, {
            name: pkgName,
            displayName: module.displayName,
            description: module.description,
            serverPath,
            clientPath,
            author: module.author,
            dependencies: module.dependencies,
            version: module.version,
            platformType: module.botmate.platformType,
          });
          this.logger.debug(`Loaded ${pkgName}`);
          this.logger.info(`Installing plugin ${pkgName} for bot ${botId}`);
          await this.install(pkgName, botId);
          this.logger.info(`Plugin ${pkgName} installed for bot ${botId}`);
          this.loadBotPlugin(pkgName, botId);

          this.app.endMaintenanceMode();
          this.app.sendClientMessage(
            `Plugin ${pkgName} installed successfully`,
          );
        } else {
          this.app.endMaintenanceMode();
          this.logger.warn(`"${pkgName}" is not a botmate plugin`);
          this.app.sendClientMessage(
            `"${pkgName}" is not a botmate plugin`,
            'error',
          );
        }
      } catch (error) {
        console.error(error);
        this.app.endMaintenanceMode();
        this.logger.error(`Error loading plugin ${pkgName}`);
        this.app.sendClientMessage(`Error loading plugin ${pkgName}`, 'error');
      }
    } catch (error) {
      this.app.endMaintenanceMode();
      console.error(error);
      this.logger.error(`Error installing plugin ${pkgName}`);
      this.app.sendClientMessage(`Error installing plugin ${pkgName}`, 'error');
    }
  }
}
