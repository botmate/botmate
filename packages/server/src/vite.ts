import react from '@vitejs/plugin-react-swc';

import { dirname, join } from 'path';
import { createServer } from 'vite';

import { Application } from './application';

export async function setupVite({
  server,
  version,
  mode,
  isMonorepo,
  isDev,
}: Application) {
  try {
    require.resolve('@botmate/client');
    require.resolve('@botmate/ui');
  } catch (e) {
    throw new Error(
      'Cannot find @botmate/client. Make sure it is installed in your project.',
    );
  }
  const client = dirname(require.resolve('@botmate/client'));
  const clientDir = dirname(client);

  const ui = dirname(require.resolve('@botmate/ui'));
  const uiDir = dirname(ui);

  const vite = await createServer({
    mode,
    plugins: [isDev() && react()],
    server: {
      middlewareMode: true,
      hmr: isDev() ? true : false,
    },
    root: join(clientDir, 'public'),
    appType: 'custom',
    logLevel: 'error',
    build: {
      minify: isDev() ? false : 'terser',
      sourcemap: isDev() ? 'inline' : false,
    },
    optimizeDeps: {
      include: ['react', 'react/jsx-runtime', 'react-dom'],
    },
    resolve: {
      alias: isMonorepo
        ? {
            '@botmate/client': join(clientDir, 'src/index.ts'),
            '@botmate/ui': join(uiDir, 'src/index.ts'),
          }
        : {},
    },
  });

  server.use(vite.middlewares);

  const clientParams = {
    version,
  };

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
      ${
        !isMonorepo
          ? 'import "@botmate/client/lib/style.css";\n' +
            'import "@botmate/ui/theme.css";'
          : ''
      }
      import { Application } from '@botmate/client';
      const app = new Application(${JSON.stringify(clientParams)});
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
