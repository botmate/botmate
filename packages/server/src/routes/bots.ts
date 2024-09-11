import { Router } from 'express';

import { Application } from '../application';
import { Bot, BotStatus } from '../bot';
import { IBot, initBotsModel } from '../models/bot';
import { initPluginModel } from '../models/plugin';

// todo: refactor services - DO NOT CALL DATABASE DIRECTLY from inside the route
export function bots({ server, database, botManager }: Application) {
  const router = Router();
  const model = initBotsModel(database.sequelize);
  const pluginModel = initPluginModel(database.sequelize);

  router.get('/', async (req, res) => {
    const bots = await model.findAll();
    res.json(bots);
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const bot = await model.findOne({
      where: {
        id,
      },
    });
    if (!bot) {
      res.status(404).json({
        message: 'Bot not found',
      });
      return;
    }
    res.json(bot);
  });

  router.post('/', async (req, res) => {
    const { credentials, platform } = req.body;
    const bot = new Bot(platform, credentials, {} as IBot);
    try {
      const info = await bot.getBotInfo();

      const exist = await model.findOne({
        where: {
          id: info.id,
        },
      });

      if (exist) {
        res.status(400).json({
          message: 'Bot already exists',
        });
        await exist.destroy();
        return;
      }
      const botData = await model.create({
        botId: info.id,
        name: info.name,
        enabled: false,
        platformType: platform,
        status: BotStatus.INACTIVE,
        credentials: credentials,
        raw: info.raw,
        avatar: info.avatar,
      });
      res.json(botData);
    } catch (e) {
      console.error(e);
      res.status(400).json({
        message: 'An error occurred while creating the bot',
      });
    }
  });

  router.get('/:id/plugins', async (req, res) => {
    const { id } = req.params;
    const bot = await model.findOne({
      where: {
        id,
      },
    });
    if (!bot) {
      res.status(404).json({
        message: 'Bot not found',
      });
      return;
    }
    const plugins = await pluginModel.findAll({
      where: {
        botId: id,
      },
    });
    res.json(plugins);
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await botManager.stop(id);
    await model.destroy({
      where: {
        id: parseInt(id),
      },
    });
    await pluginModel.destroy({
      where: {
        botId: id,
      },
    });
    res.json({
      message: 'Bot deleted',
    });
  });

  server.use('/api/bots', router);
}
