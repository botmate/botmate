import { createLogger } from '@botmate/utils';
import cors from 'cors';
import express from 'express';
import expressLogger from 'express-winston';
import { join } from 'path';

export class Http {
  app: express.Application;
  apiRouter: express.Router;

  constructor(private isDev = true) {
    this.app = express();
    this.apiRouter = express.Router();

    const logger = createLogger('http');

    this.app.use(cors());
    this.app.use(expressLogger.logger({ winstonInstance: logger }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get('/scripts/:plugin', (req, res) => {
      const { plugin } = req.params;
      const pluginDir = join(
        process.cwd(),
        `dist/packages/plugins/@botmate/${plugin.replace('.js', '')}/client`,
      );
      res.sendFile(`${pluginDir}/index.js`);
    });
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
