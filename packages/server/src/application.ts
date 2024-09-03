import { Database } from '@botmate/database';
import { createLogger } from '@botmate/logger';
import { Command } from 'commander';
import express from 'express';

import { registerCLI } from './commands';
import { Config } from './config';
import { initBotsModel } from './models/bot';
import { initPluginModel } from './models/plugin';
import { PlatformManager } from './platform-manager';
import { Plugin } from './plugin';
import { PluginManager } from './plugin-manager';
import { setupCoreRoutes } from './routes';
import { setupVite } from './vite';

export class Application {
  server = express();
  logger = createLogger({ name: Application.name });
  plugins = new Map<string, Plugin>();
  mode: 'development' | 'production' = 'development';
  isDev = this.mode === 'development';
  rootPath = process.cwd();
  database = new Database();
  config = new Config();

  protected _config: Record<string, string | number | boolean> = {};
  protected _pluginManager: PluginManager;
  protected _platformManager: PlatformManager;
  protected _cli: Command;

  get pluginManager() {
    return this._pluginManager;
  }

  get platformManager() {
    return this._platformManager;
  }

  constructor() {
    this._pluginManager = new PluginManager(this);
    this._platformManager = new PlatformManager(this);

    this._cli = this.createCLI();

    registerCLI(this);
  }

  async init(config: Record<string, string | number | boolean>) {
    this.logger.info('Initializing application...');

    this._config = config;

    initPluginModel(this.database.sequelize);
    initBotsModel(this.database.sequelize);

    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));

    await setupVite(this);
    await setupCoreRoutes(this);

    await this.pluginManager.loadAll();
    await this.database.sequelize.sync();

    await this.cli.parseAsync(process.argv);

    process.on('SIGINT', () => this.stop());
  }

  async start() {
    const { APP_PORT = 8233 } = process.env;
    this.server.listen(APP_PORT);

    this.logger.info(`Application started on port ${APP_PORT}`);
  }

  async stop() {
    this.logger.warn('Exiting application');
    process.exit(0);
  }

  protected createCLI() {
    const command = new Command('botmate');

    command.command('dev').action(() => {
      this.mode = 'development';
      this.start();
    });

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
