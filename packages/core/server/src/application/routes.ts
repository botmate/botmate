import { Application } from './application';
import { Http } from './http';

export async function registerCoreRoutes(
  app: Application,
  { apiRouter: router }: Http,
) {
  app.logger.debug('Registering core routes...');

  // health check
  router.get('/health', (req, res) => {
    res.send('OK');
  });

  // list all plugins
  router.get('/plugins', async (_, res) => {
    const plugins = await app.pluginManager.getPlugins();
    res.json(plugins);
  });
}
