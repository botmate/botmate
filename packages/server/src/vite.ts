import { readFile } from 'fs/promises';
import { join } from 'path';
import { createServer } from 'vite';

import { Application } from './application';

export async function setupVite({ server, isDev }: Application) {
  if (isDev()) {
    return;
  }

  const appPkg = require.resolve('@botmate/app/package.json');

  const dir = join(appPkg, '..');
  const client = join(dir, 'client');

  const vite = await createServer({
    server: {
      middlewareMode: true,
    },
    root: client,
    appType: 'custom',
    logLevel: 'error',
    resolve: {
      alias: {
        '@botmate/client': require.resolve('@botmate/client'),
        '@botmate/ui': require.resolve('@botmate/ui'),
      },
    },
  });

  server.use(vite.middlewares);

  server.get('*', async (req, res) => {
    const template = await readFile(join(client, 'index.html'), 'utf-8');
    res.end(await vite.transformIndexHtml(req.url, template));
  });

  return vite.middlewares;
}
