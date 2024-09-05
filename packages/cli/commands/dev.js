require('colors');
const { Command } = require('commander');
const execa = require('execa');
const { existsSync } = require('fs');
const { join, dirname } = require('path');
const { createServer } = require('vite');

const dev = new Command('dev');

dev.allowUnknownOption();
dev.option('-p, --port <port>', 'port to run the server on', '8233');
dev.option('-s, --server', 'run the server on the same port as the client');
dev.option('-c, --client <client>', 'path to the client directory');

dev.action(async (opts) => {
  console.log('Starting development server...'.green);
  const { APP_PACKAGE_ROOT } = process.env;

  let { port, server, client } = opts;

  process.env.APP_PORT = port;

  let serverPort, clientPort;

  if (!server && !client) {
    clientPort = port;
    serverPort = parseInt(port) + 1;

    process.env.APP_PORT = serverPort;

    server = true;
    client = true;
  }

  if (server) {
    let serverDir = join(APP_PACKAGE_ROOT, 'src');

    if (!existsSync(serverDir)) {
      serverDir = require.resolve('@botmate/app');
    }

    const tsx = join(dirname(require.resolve('tsx')), 'cli.mjs');

    const argv = [
      tsx,
      'watch',
      '--ignore=./storage/**',
      '--tsconfig tsconfig.json',
      '-r',
      'tsconfig-paths/register',
      serverDir,
      'dev',
    ];

    execa('node', argv, {
      shell: true,
      stdio: 'inherit',
      env: { ...process.env },
    });
  }

  if (client) {
    const uiDir = join(process.cwd(), 'packages/ui');
    let clientSdk = join(process.cwd(), 'packages/client/src/index.ts');

    if (existsSync(uiDir)) {
      execa('pnpm', ['dev'], {
        cwd: uiDir,
        stdio: 'inherit',
      });
    }

    if (!existsSync(clientSdk)) {
      clientSdk = require.resolve('@botmate/client');
    }

    const appClientDir = join(APP_PACKAGE_ROOT, 'client');

    if (existsSync(appClientDir)) {
      const react = await import('@vitejs/plugin-react-swc');
      const tsconfigPaths = await import('vite-tsconfig-paths');

      const viteServer = await createServer({
        root: appClientDir,
        plugins: [react.default(), tsconfigPaths.default()],
        logLevel: 'error',
        define: {
          'process.env.ENDPOINT': `"http://localhost:${serverPort}"`,
        },
        server: {
          port: clientPort,
          proxy: {
            '/api': `http://localhost:${serverPort}`,
          },
          host: '0.0.0.0',
        },
        resolve: {
          alias: {
            '@botmate/client': clientSdk,
          },
        },
      });

      await viteServer.listen(clientPort);
      viteServer.printUrls();
    }
  }
});

module.exports = dev;
