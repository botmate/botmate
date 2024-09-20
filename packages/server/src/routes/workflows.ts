import { Router } from 'express';

import { Application } from '../application';

export function workflows({ server, workflowManager, logger }: Application) {
  const router = Router();

  router.get('/events', async (req, res) => {
    const { platform } = req.query as { platform: string };
    if (!platform) {
      res.status(400).json({
        message: 'Platform is required',
      });
      return;
    }
    try {
      const events = await workflowManager.getEvents(platform);
      res.json(events);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({
          message: e.message,
        });
      } else {
        logger.error(e);
        res.status(500).end();
      }
    }
  });

  router.get('/actions', async (req, res) => {
    const { platform } = req.query as { platform: string };
    if (!platform) {
      res.status(400).json({
        message: 'Platform is required',
      });
      return;
    }
    try {
      const events = await workflowManager.getActions(platform);
      res.json(events);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({
          message: e.message,
        });
      } else {
        logger.error(e);
        res.status(500).end();
      }
    }
  });

  server.use('/api/workflows', router);
}
