import { Application } from './application';
import { Http } from './http';

export async function registerCoreRoutes(app: Application, { router }: Http) {
  app.logger.info('Registering core routes...');

  // health check
  router.get('/health', (ctx) => {
    ctx.body = 'OK';
  });

  // list all plugins
  router.get('/plugins', async (ctx) => {
    const plugins = await app.pluginManager.getPlugins();
    ctx.body = plugins;
  });
}
