import { createLogger, winston } from '@botmate/logger';
import * as trpcExpress from '@trpc/server/adapters/express';
import { Command } from 'commander';
import cookieParser from 'cookie-parser';
import execa from 'execa';
import express from 'express';
import { writeFile } from 'fs/promises';
import { Server } from 'http';
import ip from 'ip';
import ora from 'ora';
import { join } from 'path';
import socket, { Socket } from 'socket.io';

import { BotManager } from './bot-manager';
import { registerCLI } from './commands';
import { ConfigManager } from './config';
import { connectToDatabase } from './database';
import { env } from './env';
import { HookManager } from './hook-manager';
import { PlatformManager, PlatformMeta } from './platform-manager';
import { Plugin } from './plugin';
import { PluginManager } from './plugin-manager';
import { initTrpc } from './services/_trpc';
import { AuthService } from './services/auth.service';
import { BotsService } from './services/bots.service';
import { PluginsService } from './services/plugins.service';
import { RPCService } from './services/rpc.service';
import { UsersService } from './services/users.service';
import { setupVite } from './vite';
import { WorkflowManager } from './workflow-manager';

export type ApplicationOptions = {
  mode?: 'development' | 'production';
  port?: number;
  dbString: string;
};

type Maintenance = {
  title: string;
  message: string;
};

export class Application {
  http?: Server;
  server: express.Application = express();
  logger: winston.Logger = createLogger({ name: Application.name });
  plugins = new Map<string, Plugin>();

  mode: 'development' | 'production' = 'development';
  isDev = () => this.mode === 'development';
  isMonorepo = process.env.IS_MONOREPO !== undefined;
  port = process.env.PORT || 8233;
  rootPath = process.cwd();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: string = require('../package.json').version;
  platforms: PlatformMeta[] = [];
  env = env;

  launchTime = Date.now();
  maintenance: Maintenance | null = null;

  protected _pluginManager: PluginManager;
  protected _platformManager: PlatformManager;
  protected _botManager: BotManager;
  protected _configManager: ConfigManager;
  protected _cli: Command;
  protected _socket?: Socket;
  protected _workflowManager: WorkflowManager;
  protected _hookManager: HookManager;

  protected _users: UsersService;
  protected _auth: AuthService;
  protected _bots: BotsService;
  protected _plugins: PluginsService;
  protected _rpc: RPCService;

  get hooks() {
    return this._hookManager;
  }

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

  get usersService() {
    return this._users;
  }

  get authService() {
    return this._auth;
  }

  get botsService() {
    return this._bots;
  }

  get pluginsService() {
    return this._plugins;
  }

  get rpcService() {
    return this._rpc;
  }

  constructor(private options: ApplicationOptions) {
    if (process.env.NODE_ENV === 'development') {
      this.mode = 'development';
    }

    this.port = options?.port || this.port;
    this.mode = options?.mode || this.mode;

    this._pluginManager = new PluginManager(this);
    this._platformManager = new PlatformManager(this);
    this._botManager = new BotManager(this);
    this._configManager = new ConfigManager(this);
    this._workflowManager = new WorkflowManager(this);
    this._hookManager = new HookManager();

    this._auth = new AuthService(this);
    this._users = new UsersService(this);
    this._bots = new BotsService(this);
    this._plugins = new PluginsService(this);
    this._rpc = new RPCService(this);

    this._cli = this.createCLI();

    registerCLI(this);
  }

  async getSchemas() {
    const serverSchemas = join(__dirname, 'schemas');
    const platformSchemas = this.platforms.map((platform) =>
      join(platform.path, 'schemas'),
    );
    return [serverSchemas, ...platformSchemas];
  }

  async connectToDatabase() {
    const mongoose = await connectToDatabase(this.options.dbString);
    return async () => {
      await mongoose.disconnect();
    };
  }

  async init() {
    this.logger.info('initializing...');
    this.platforms = await this.platformManager.listPlatforms();

    this.logger.debug('connecting to database...');

    await this.connectToDatabase();

    this.logger.debug('database connected');

    this.server.use(cookieParser());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.static(join(this.rootPath, 'storage')));

    const router = initTrpc(this);

    this.server.use(
      '/api/trpc',
      trpcExpress.createExpressMiddleware({
        router,
        createContext: async (opts) => {
          const { req }: { req: express.Request } = opts;
          const token = req.cookies._bmat;
          const user = await this._auth.getUserFromToken(token);
          return {
            user,
          };
        },
      }),
    );

    await setupVite(this);

    await this.botManager.init();
    await this.pluginManager.init();

    const totalUsers = await this._users.countUsers();

    if (totalUsers === 0) {
      this.logger.info('No users found, creating default "admin" user');
      await this._users.createDefaultUser();
    }

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

  setMaintenanceMode(title: string, message: string) {
    if (this._socket) {
      this.maintenance = {
        title,
        message,
      };
      this._socket.emit('maintenance_start', this.maintenance);
    }
  }

  endMaintenanceMode() {
    if (this._socket) {
      this.maintenance = null;
      this._socket.emit('maintenance_end');
    }
  }

  sendClientMessage(message: string, type: 'info' | 'error' = 'info') {
    if (this._socket) {
      this._socket.emit('server_message', {
        message,
        type,
      });
    }
  }

  async start() {
    const localIp = ip.address();

    this.http = this.server.listen(this.port);

    const io = new socket.Server(this.http);

    io.on('connection', (socket) => {
      this._socket = socket;

      if (this.maintenance) {
        socket.emit('maintenance_start', this.maintenance);
      }

      socket.on('install_plugin', async (data) => {
        await this.pluginManager.installFromNpm(data.package_name, data.bot_id);
        this.endMaintenanceMode();
      });
    });

    this.logger.info(
      `started on http://${this.isDev() ? 'localhost' : localIp}:${this.port}`,
    );
  }

  async stop() {
    this.logger.warn('Exiting application');
    process.exit(0);
  }

  async restart() {
    this.pluginManager.create;

    await this.stop();
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

export type { AppRouter } from './services/_trpc';
export type { IBot } from './models/bots.model';
export type { IUser } from './models/users.model';
export type { IPlugin } from './models/plugins.model';
