import { createLogger } from '@botmate/utils';
import express from 'express';
import expressLogger from 'express-winston';

export class Http {
  app: express.Application;
  apiRouter: express.Router;

  constructor(private isDev = true) {
    this.app = express();
    this.apiRouter = express.Router();

    const logger = createLogger('http');

    this.app.use(expressLogger.logger({ winstonInstance: logger }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  async init() {
    if (this.isDev) {
      //
    }
  }

  public listen(port: number) {
    this.app.use('/api', this.apiRouter);
    this.app.listen(port);
  }
}
