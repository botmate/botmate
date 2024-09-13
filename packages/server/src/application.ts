import { Database } from '@botmate/database';
import { createLogger, winston } from '@botmate/logger';
import { Command } from 'commander';
import express from 'express';

import { BotManager } from './bot-manager';
import { registerCLI } from './commands';
import { ConfigManager } from './config';
import { initBotsModel } from './models/bot';
import { initPluginModel } from './models/plugin';
import { PlatformManager } from './platform-manager';
import { Plugin } from './plugin';
import { PluginManager } from './plugin-manager';
import { setupCoreRoutes } from './routes';
import { setupVite } from './vite';

export class Application {
  server: express.Application = express();
  logger: winston.Logger = createLogger({ name: Application.name });
  plugins = new Map<string, Plugin>();

  mode: 'development' | 'production' = 'development';
  isDev = () => this.mode === 'development';
  isMonorepo = process.env.IS_MONOREPO !== undefined;
  port = process.env.PORT || 8233;
  rootPath = process.cwd();
  database = new Database();
  version: string = require('../package.json').version;

  protected _pluginManager: PluginManager;
  protected _platformManager: PlatformManager;
  protected _botManager: BotManager;
  protected _configManager: ConfigManager;
  protected _cli: Command;

  get pluginManager() {
    return this._pluginManager;
  }

  get platformManager() {
    return this._platformManager;
  }

  get botManager() {
    return this._botManager;
  }

  get configManager() {
    return this._configManager;
  }

  constructor() {
    this._pluginManager = new PluginManager(this);
    this._platformManager = new PlatformManager(this);
    this._botManager = new BotManager(this);
    this._configManager = new ConfigManager(this);

    this._cli = this.createCLI();

    registerCLI(this);
  }

  async init() {
    this.logger.info('Initializing application...');

    initPluginModel(this.database.sequelize);
    initBotsModel(this.database.sequelize);

    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));

    await setupCoreRoutes(this);
    await setupVite(this);

    await this.database.sequelize.sync();

    if (process.env.NODE_ENV === 'development') {
      this.mode = 'development';
    }

    await this.botManager.init();
    await this.pluginManager.init();

    process.on('SIGINT', () => this.stop());
  }

  async getLatestVersion() {
    try {
      const response = await fetch(
        `https://registry.npmjs.org/-/package/@botmate/server/dist-tags`,
      );
      const data = await response.json();
      return data.latest;
    } catch (e) {
      this.logger.error('Failed to get latest version');
    }
  }

  async start() {
    this.server.listen(this.port);

    this.logger.info(`Application started on port ${this.port}`);
  }

  async stop() {
    this.logger.warn('Exiting application');
    process.exit(0);
  }

  protected createCLI() {
    const command = new Command('botmate');
    return command;
  }

  get cli() {
    return this._cli;
  }

  get command() {
    return this._cli.command;
  }

  get addCommand() {
    return this._cli.addCommand;
  }
}
