import { PlatformType } from '@botmate/platform';
import { Router } from 'express';

import { Application } from '../application';

export function plugins({ server, pluginManager }: Application) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { platform } = req.query;
    const plugins = await pluginManager.getPlugins(platform as PlatformType);
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

  router.get('/bots', async (req, res) => {
    const { botId } = req.query;
    if (!botId) {
      res.status(400).json({
        message: 'botId not found',
      });
    }
    const plugins = await pluginManager.getBotPligins(botId as string);
    res.json(plugins);
  });

  router.post('/enable', async (req, res) => {
    const { name, botId } = req.body;
    try {
      await pluginManager.enable(name, botId);
      res.json({
        message: 'Plugin enabled',
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
        message: 'An error occurred while enabling the plugin',
      });
    }
  });

  router.post('/disable', async (req, res) => {
    const { botId, name } = req.body;

    try {
      await pluginManager.disable(name, botId);
      res.json({
        message: 'Plugin disabled',
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
        message: 'An error occurred while disabling the plugin',
      });
    }
  });

  server.use('/api/plugins', router);
}
