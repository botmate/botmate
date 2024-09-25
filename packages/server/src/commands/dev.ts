import colors from 'colors/safe';

import { Application } from '../application';

export default function dev(app: Application) {
  const dev = app.cli.command('dev');

  dev.description('start the development server');

  dev.option('-p, --port <port>', 'port to start the server on', '8233');

  dev.action(async ({ port }) => {
    app.port = port;
    app.mode = 'development';

    const url = 'https://polar.sh/btomate';
    const text = 'Donate to support the project';

    console.log(
      `${colors.red('♥')} BotMate (${colors.bold(`v${app.version}`).green}) - \u001b]8;;${url}\u0007${text}\u001b]8;;\u0007`,
    );

    console.log();

    app.init().then(() => app.start());
  });
}
