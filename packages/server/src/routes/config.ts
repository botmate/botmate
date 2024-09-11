import { Router } from 'express';

import { Application } from '../application';

export function config({ server, botConfigManager }: Application) {
  const router = Router();

  router.post('/save', async (req, res) => {
    const { botId, key, value } = req.body;
    await botConfigManager.save(parseInt(botId), key, value);
    res.json({ success: true });
  });

  router.get('/get', async (req, res) => {
    const { botId, key } = req.query;
    const value = await botConfigManager.get(
      parseInt(String(botId)),
      key as string,
    );
    res.json(value);
  });

  server.use('/api/config', router);
}
