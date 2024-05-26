import { createLogger, env } from '@botmate/utils';
import cors from 'cors';
import express from 'express';
import expressLogger from 'express-winston';
import { join } from 'node:path';

export class Http {
  app: express.Application;
  apiRouter: express.Router;

  constructor() {
    this.app = express();
    this.apiRouter = express.Router();

    const logger = createLogger('http');

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.apiRouter.use(expressLogger.logger({ winstonInstance: logger }));
  }

  async init() {
    const alias = new Map<string, string>();

    if (env.NODE_ENV === 'production') {
      // these packages can be required from plugins
      const corePkgs = ['client', 'ui'];
      for (const pkg of corePkgs) {
        alias.set(`@botmate/${pkg}`, require.resolve(`@botmate/${pkg}`));
      }
    }
    this.app.use(express.static(join(__dirname, '..', 'dist')));
  }

  public listen(port: number) {
    this.app.use('/api', this.apiRouter);

    this.app.get('*', async (_, res) => {
      try {
        let htmlPath = join(process.cwd(), 'index.html');
        htmlPath = join(__dirname, '..', 'dist', 'index.html');
        res.sendFile(htmlPath);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          res.status(500).send(error.message);
        }
      }
    });
    this.app.listen(port);
  }
}
