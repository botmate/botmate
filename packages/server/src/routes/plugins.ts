import { Router } from 'express';

import { Application } from '../application';
import { initPluginModel } from '../models/plugin';

export function plugins({ server, database }: Application) {
  const router = Router();
  const pluginsModel = initPluginModel(database.sequelize);

  router.get('/', async (req, res) => {
    const plugins = await pluginsModel.findAll();
    res.json(plugins);
  });

  server.use('/api/plugins', router);
}
