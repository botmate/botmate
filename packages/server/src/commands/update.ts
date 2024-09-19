import { Application } from '../application';

export default function update(app: Application) {
  const update = app.cli.command('update');

  update.description('update the botmate to the latest version');

  update.action(async () => {
    app.update();
  });
}
