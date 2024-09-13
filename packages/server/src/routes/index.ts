import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';
import { bots } from './bots';
import { config } from './config';
import { platforms } from './platforms';
import { plugins } from './plugins';

export async function setupCoreRoutes(app: Application) {
  [bots, plugins, platforms, config].forEach((setup) => {
    app.logger.debug(`Setting up core routes: ${setup.name}`);
    setup(app);
  });

  // todo: separate routes
  app.server.get('/uploads/:file', (req, res) => {
    // const uploadsFolder = app.config.get('uploadsFolder', 'uploads');
    const uploadsFolder = join(app.rootPath, 'storage/uploads');
    const file = join(uploadsFolder, req.params.file);
    if (existsSync(file)) {
      res.sendFile(file);
      return;
    }
    res.status(404).end('File not found');
  });

  app.server.get('/version', (req, res) => {
    res.end(app.version);
  });
}
