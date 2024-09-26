import { PlatformType } from '@botmate/platform';
import { z } from 'zod';

import { Application } from '../application';
import { Bot } from '../bot';
import { BotModel, SafeBot } from '../models/bots.model';
import { authedProcedure, publicProcedure } from './_trpc';

export class BotsService {
  constructor(private app: Application) {}

  async createBot(platform: PlatformType, credentials: Record<string, string>) {
    const bot = new Bot(platform, credentials);
    try {
      const info = await bot.getBotInfo();
      return BotModel.create({
        id: info.id,
        avatar: info.avatar,
        raw: info.raw,
        name: info.name,
        credentials,
        enabled: false,
        config: {},
        platformType: platform,
      });
    } catch (e) {
      this.app.logger.error(e);
      throw new Error('An error occurred while creating the bot');
    }
  }

  async listBots() {
    const bots = await BotModel.find();
    return bots.map((bot) => bot.toObject());
  }

  async deleteBot(botId: string) {
    //
  }

  async getBot(botId: string) {
    const bot = await BotModel.findById(botId);
    if (bot) {
      return bot as unknown as SafeBot;
    }

    throw new Error('Bot not found');
  }

  async getPlatformList() {
    return this.app.platformManager.listPlatforms();
  }

  getRoutes() {
    return {
      listBots: authedProcedure.query(() => {
        return this.listBots();
      }),
      getBot: publicProcedure.input(z.string()).query(({ input }) => {
        return this.getBot(input);
      }),
      createBot: publicProcedure
        .input(
          z.object({
            platform: z.nativeEnum(PlatformType),
            credentials: z.any(),
          }),
        )
        .mutation(({ input }) => {
          return this.createBot(input.platform, input.credentials);
        }),
      deleteBot: publicProcedure.input(z.string()).mutation((input) => {}),
      getPlatformList: publicProcedure.query(() => {
        return this.getPlatformList();
      }),
    };
  }
}
