import { Router } from 'express';

import { Application } from '../application';
import { Bot, BotStatus, initBotsModel } from '../bot';

// todo: refactor models and services
export function bots({ server, database }: Application) {
  const router = Router();
  const model = initBotsModel(database.sequelize);

  router.get('/', async (req, res) => {
    const bots = await model.findAll();
    res.json(bots);
  });
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const bot = await model.findOne({
      where: {
        id
      }
    });
    if (!bot) {
      res.status(404).json({
        message: 'Bot not found'
      });
      return;
    }
    res.json(bot);
  });
  router.post('/', async (req, res) => {
    const { credentials, platform } = req.body;
    const bot = new Bot(platform, credentials);
    try {
      const info = await bot.getBotInfo();

      const exist = await model.findOne({
        where: {
          id: info.id
        }
      });

      if (exist) {
        // res.status(400).json({
        //   message: 'Bot already exists',
        // });
        await exist.destroy();
        // return;
      }
      const botData = await model.create({
        botId: info.id,
        name: info.name,
        enabled: false,
        platformType: platform,
        status: BotStatus.INACTIVE,
        credentials: credentials,
        raw: info.raw,
        avatar: info.avatar
      });
      res.json(botData);
    } catch (e) {
      console.error(e);
      res.status(400).json({
        message: 'An error occurred while creating the bot'
      });
    }
  });

  server.use('/api/bots', router);
}
