import { Router } from 'express';

import { Application } from '../application';

export function platforms({ server, platformManager }: Application) {
  const router = Router();

  router.get('/', async (req, res) => {
    const platforms = await platformManager.listPlatforms();
    res.json(platforms);
  });

  server.use('/api/platforms', router);
}
