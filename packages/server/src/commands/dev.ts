import { Application } from '../application';

export default function dev(app: Application) {
  const dev = app.cli.command('dev');

  dev.description('start the development server');

  dev.option('-p, --port <port>', 'port to start the server on', '8233');

  dev.action(async ({ port }) => {
    app.port = port;
    app.mode = 'development';

    app.init().then(() => app.start());
  });
}
