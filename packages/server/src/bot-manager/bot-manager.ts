import { PlatformType } from '@botmate/platform';

import { Application } from '../application';
import { Bot } from '../bot/bot';
import { BotModel } from '../models/bots.model';

export class BotManager {
  private _bots: Map<string, Bot> = new Map();

  totalBots = 0;

  constructor(private app: Application) {}

  /**
   * `init` method initializes the bot manager loads all the added bots in the `_bots` map.
   */
  async init() {
    const allBots = await BotModel.find();
    this.totalBots = allBots.length;
    for (const bot of allBots) {
      const botInstance = new Bot(
        bot.platformType as PlatformType,
        bot.credentials as Record<string, string>,
        bot,
      );
      this._bots.set(bot.id, botInstance);
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
    let c = 0;
    for (const bot of this._bots.values()) {
      // todo: check for enabled
      // if (bot.enabled)
      bot.start();
      c++;
    }
    return c;
  }

  async stop(id: string) {
    const bot = this._bots.get(id);
    if (!bot) {
      return;
    }
    await bot.stop();
  }
}
