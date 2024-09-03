import { Application } from '../application';

export default function start(app: Application) {
  const start = app.cli.command('start');

  start.action(() => {
    console.log('start');
  });
}
