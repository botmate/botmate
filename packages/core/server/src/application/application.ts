import { Database } from '@botmate/database';
import { Logger, createLogger, env } from '@botmate/utils';
import colors from 'colors';

import { Http } from './http';
import { PluginManager } from './plugin-manager';
import { registerCoreRoutes } from './routes';

interface ApplicationOptions {
  port?: number;
  isProd?: boolean;
}

export class Application {
  protected http: Http;
  protected database: Database;

  started = false;
  initialized = false;
  isDev = env.NODE_ENV === 'development';
  pluginManager: PluginManager;
  logger: Logger = createLogger();

  constructor(private options: ApplicationOptions = {}) {
    this.http = new Http();
    this.database = new Database({
      logger: createLogger('database'),
    });
    this.pluginManager = new PluginManager(this);
    this.isDev = options.isProd ?? this.isDev;
  }

  get db() {
    return this.database.sequelize;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    this.logger.info('Initializing application...');

    await this.pluginManager.initialize();

    await this.db.sync();
    this.logger.debug('Database synchronized');

    await this.http.init();
    await registerCoreRoutes(this, this.http);

    this.initialized = true;
  }

  async start() {
    if (this.started) {
      return;
    }
    this.logger.info('Starting application...');

    await this.pluginManager.loadAll();

    const { port = env.PORT } = this.options;

    this.http.listen(port);

    this.logger.info(
      `Application started on port ${colors.bold(port.toString())}`,
    );

    this.started = true;
  }

  async install() {
    this.logger.info('Installing plugins...');

    const plugins = await this.pluginManager.getPlugins();
    for (const plugin of plugins) {
      this.logger.info(`Installing ${colors.bold(plugin.name)}`);
      await this.pluginManager.install(plugin.name);
    }
  }

  get router() {
    return this.http.apiRouter;
  }
}
