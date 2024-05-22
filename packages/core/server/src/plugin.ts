import { Logger } from '@botmate/utils';

import { Application } from './application';

export class Plugin {
  logger: Logger;

  protected app: Application;

  constructor(app: Application, logger: Logger) {
    this.app = app;
    this.logger = logger;
  }

  get db() {
    return this.app.db;
  }

  get router() {
    return this.app.router;
  }

  async beforeLoad() {
    this.logger.warn('beforeLoad not implemented');
  }
  async load() {
    this.logger.warn('load not implemented');
  }
}
