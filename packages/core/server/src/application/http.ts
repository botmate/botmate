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

    if (env.NODE_ENV === 'production') {
      // these packages can be required from plugins
      const corePkgs = ['client', 'ui'];
      for (const pkg of corePkgs) {
        alias.set(`@botmate/${pkg}`, require.resolve(`@botmate/${pkg}`));
      }
    }

    const vite = await createViteServer({
      plugins: [
        react(),
        ...(env.NODE_ENV === 'production' ? [] : [tsconfigPaths()]),
      ],
      server: {
        middlewareMode: true,
        watch: {
          ignored: 'packages/core/**',
        },
      },
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

    if (this.vite !== undefined)
      this.app.get('*', async (req, res, next) => {
        const url = req.originalUrl;

        if (url.startsWith('/assets')) {
          return next();
        }

        try {
          let htmlPath = join(process.cwd(), 'index.html');
          if (env.NODE_ENV === 'production') {
            htmlPath = join(__dirname, '..', 'build', 'index.html');
          }
          const htmlContent = await readFile(htmlPath, 'utf-8');
          const template = await this.vite?.transformIndexHtml(
            url,
            htmlContent,
          );

          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
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
