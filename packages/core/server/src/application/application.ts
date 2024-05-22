import { Database } from '@botmate/database';
import { Logger, createLogger, env } from '@botmate/utils';
import colors from 'colors';

import { Http } from './http';
import { PluginManager } from './plugin-manager';

interface ApplicationOptions {
  port?: number;
}

export class Application {
  protected http: Http;
  protected database: Database;
  protected pluginManager: PluginManager;

  logger: Logger = createLogger();
  isDev = env.NODE_ENV === 'development';
  started = false;
  initialized = false;

  constructor(private options: ApplicationOptions = {}) {
    this.http = new Http();
    this.database = new Database({
      logger: createLogger('database'),
    });
    this.pluginManager = new PluginManager(this);
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

    this.initialized = true;
  }

  get router() {
    return this.http.router;
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
}
