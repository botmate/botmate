import react from '@vitejs/plugin-react-swc';

import { dirname, join } from 'path';
import { createServer } from 'vite';

import { Application } from './application';

export async function setupVite({
  server,
  isDev,
  mode,
  isTSProject,
}: Application) {
  const client = require.resolve('@botmate/client/package.json');
  const clientDir = dirname(client);

  const vite = await createServer({
    mode,
    plugins: [isTSProject && react()],
    server: {
      middlewareMode: true,
      hmr: isTSProject ? true : false,
    },
    root: join(clientDir, 'public'),
    appType: 'custom',
    logLevel: 'error',
    build: {
      minify: false,
      sourcemap: true,
    },
    optimizeDeps: {
      include: ['react', 'react/jsx-runtime'],
    },
    resolve: {
      alias: isTSProject
        ? {
            '@botmate/client': join(clientDir, 'src/index.ts'),
          }
        : {},
    },
  });

  server.use(vite.middlewares);

  server.get('*', async (req, res) => {
    res.end(
      await vite.transformIndexHtml(
        req.url,
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BotMate</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      ${isTSProject ? 'import "@botmate/client/lib/style.css";' : ''}
      import { Application } from '@botmate/client';
      const app = new Application();
      app.render('root');
    </script>
  </body>

  <!-- Google tag (gtag.js) -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-QMC0BN9WRX"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-QMC0BN9WRX');
  </script>
</html>
`,
      ),
    );
  });

  return vite.middlewares;
}
