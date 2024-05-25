import react from '@vitejs/plugin-react';

import { createLogger, env } from '@botmate/utils';
import cors from 'cors';
import express from 'express';
import expressLogger from 'express-winston';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ViteDevServer, createServer as createViteServer } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export class Http {
  app: express.Application;
  apiRouter: express.Router;
  vite: ViteDevServer | undefined;

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

    const vite = await createViteServer({
      plugins: [react(), tsconfigPaths()],
      server: { middlewareMode: true },
      appType: 'custom',

      resolve: {
        alias: Object.fromEntries(alias),
      },
    });

    this.vite = vite;
    if (env.NODE_ENV === 'production') {
      this.app.use(express.static(join(__dirname, '..', 'build')));
    }
    this.app.use(vite.middlewares);
  }

  public listen(port: number) {
    this.app.use('/api', this.apiRouter);
    if (env.NODE_ENV === 'development')
      this.app.use('*', async (req, res) => {
        const url = req.originalUrl;

        try {
          const htmlPath = join(process.cwd(), 'index.html');
          const htmlContent = await readFile(htmlPath, 'utf-8');
          const template = await this.vite.transformIndexHtml(url, htmlContent);

          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (error) {
          console.error(error);
          res.status(500).send(error.message);
        }
      });
    this.app.listen(port);
  }
}
