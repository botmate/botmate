import { Database } from '@botmate/database';
import { createLogger, winston } from '@botmate/logger';
import { Command } from 'commander';
import execa from 'execa';
import express from 'express';
import { writeFile } from 'fs/promises';
import ora from 'ora';
import { join } from 'path';
import socket, { Socket } from 'socket.io';

import { BotManager } from './bot-manager';
import { registerCLI } from './commands';
import { ConfigManager } from './config';
import { Migrations } from './migrations';
import { initBotsModel } from './models/bot';
import { initPluginModel } from './models/plugin';
import { PlatformManager } from './platform-manager';
import { Plugin } from './plugin';
import { PluginManager } from './plugin-manager';
import { setupCoreRoutes } from './routes';
import { setupVite } from './vite';
import { WorkflowManager } from './workflow-manager';

export type ApplicationOptions = {
  dbPath?: string;
  mode?: 'development' | 'production';
  port?: number;
};

export class Application {
  server: express.Application = express();
  logger: winston.Logger = createLogger({ name: Application.name });
  plugins = new Map<string, Plugin>();
  database: Database;

  mode: 'development' | 'production' = 'development';
  isDev = () => this.mode === 'development';
  isMonorepo = process.env.IS_MONOREPO !== undefined;
  port = process.env.PORT || 8233;
  rootPath = process.cwd();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: string = require('../package.json').version;

  protected _pluginManager: PluginManager;
  protected _platformManager: PlatformManager;
  protected _botManager: BotManager;
  protected _configManager: ConfigManager;
  protected _cli: Command;
  protected _socket?: Socket;
  protected _migrations: Migrations;
  protected _workflowManager: WorkflowManager;

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

  get workflowManager() {
    return this._workflowManager;
  }

  constructor(private options?: ApplicationOptions) {
    if (process.env.NODE_ENV === 'development') {
      this.mode = 'development';
    }

    this.port = options?.port || this.port;
    this.mode = options?.mode || this.mode;

    this.database = new Database({
      dbPath: options?.dbPath,
    });

    this._migrations = new Migrations(this.database);
    this._pluginManager = new PluginManager(this);
    this._platformManager = new PlatformManager(this);
    this._botManager = new BotManager(this);
    this._configManager = new ConfigManager(this);
    this._workflowManager = new WorkflowManager(this);

    this._cli = this.createCLI();

    registerCLI(this);
  }

  async init() {
    this.logger.info('Initializing application...');

    await this._migrations.runMigrations();

    initPluginModel(this.database.sequelize);
    initBotsModel(this.database.sequelize);

    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));

    await setupCoreRoutes(this);
    await setupVite(this);

    await this.database.sequelize.sync();

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
    const server = this.server.listen(this.port);

    const io = new socket.Server(server);

    io.on('connection', (socket) => {
      this._socket = socket;
    });

    this.logger.info(`Application started on port ${this.port}`);
  }

  async stop() {
    this.logger.warn('Exiting application');
    process.exit(0);
  }

  async update() {
    console.log();

    const spinner = ora(`Checking for updates...`).start();
    const latestVersion = await this.getLatestVersion();

    if (latestVersion !== this.version) {
      spinner.succeed(`Found new version ${latestVersion}`);

      const updateSpinner = ora('Updating...').start();

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pkgJson = require(join(this.rootPath, 'package.json'));

      let pkgFound = false;
      for (const [pkg, version] of Object.entries(pkgJson.dependencies || {})) {
        if (pkg.startsWith('@botmate/')) {
          if (version !== latestVersion) {
            pkgFound = true;
            pkgJson.dependencies[pkg] = latestVersion;
          }
        }
      }

      if (!pkgFound) {
        updateSpinner.succeed('No updates found');
        return;
      }

      await writeFile(
        join(this.rootPath, 'package.json'),
        JSON.stringify(pkgJson, null, 2),
      );

      updateSpinner.text = 'Installing dependencies...';

      await execa('pnpm', ['install']);

      updateSpinner.succeed('Dependencies installed');
    } else {
      spinner.succeed(`No update needed. Already on latest version.`);
    }
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
