import { Application } from '../application';

export default function pm(app: Application) {
  const pm = app.cli.command('pm');

  pm.command('list').action(() => {
    const plugins = app.pluginManager.getPlugins();
    // console.log('plugins', plugins);
  });
}
