import { Router } from 'express';

import { Application } from '../application';

export function config({ server, configManager }: Application) {
  const router = Router();

  router.post('/plugin/save', async (req, res) => {
    const { pluginId, key, value } = req.body;
    await configManager.savePluginConfig(pluginId, key, value);
    res.json({ success: true });
  });

  router.get('/plugin/get', async (req, res) => {
    const { pluginId, key } = req.query;
    const value = await configManager.getPluginConfig(
      String(pluginId),
      key as string,
    );
    res.json(value);
  });

  server.use('/api/config', router);
}
