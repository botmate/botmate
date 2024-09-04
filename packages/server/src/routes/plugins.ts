import { Router } from 'express';

import { Application } from '../application';

export function plugins({ server, database, pluginManager }: Application) {
  const router = Router();

  router.get('/', async (_, res) => {
    const plugins = await pluginManager.getPlugins();
    res.json(plugins);
  });

  router.post('/install', async (req, res) => {
    const { name, botId } = req.body;
    try {
      await pluginManager.install(name, botId);
      res.json({
        message: 'Plugin installed',
      });
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({
          message: e.message,
        });
        return;
      }
      console.error(e);
      res.status(400).json({
        message: 'An error occurred while installing the plugin',
      });
    }
  });

  router.post('/uninstall', async (req, res) => {
    const { name, botId } = req.body;
    try {
      await pluginManager.uninstall(name, botId);
      res.json({
        message: 'Plugin uninstalled',
      });
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({
          message: e.message,
        });
        return;
      }
      console.error(e);
      res.status(400).json({
        message: 'An error occurred while uninstalling the plugin',
      });
    }
  });

  server.use('/api/plugins', router);
}
