import { PlatformType } from '@botmate/platform';

import { Application } from '../application';
import { Bot } from '../bot/bot';
import { BotModel } from '../models/bots.model';

export class BotManager {
  private _bots: Map<string, Bot> = new Map();

  constructor(private app: Application) {}

  /**
   * `init` method initializes the bot manager loads all the added bots in the `_bots` map.
   */
  async init() {
    const allBots = await BotModel.find();
    for (const bot of allBots) {
      const botInstance = new Bot(
        bot.platformType as PlatformType,
        bot.credentials as Record<string, string>,
        bot,
      );
      this._bots.set(bot.id, botInstance);

      await botInstance.init(this.app);
    }
  }

  async findById(id: string) {
    return BotModel.findOne({
      id,
    });
  }

  get bots() {
    return this._bots;
  }

  async startAll() {
    for (const bot of this._bots.values()) {
      // todo: check for enabled
      // if (bot.enabled)
      bot.start();
    }
  }

  async stop(id: string) {
    const bot = this._bots.get(id);
    if (!bot) {
      return;
    }
    await bot.stop();
  }
}
