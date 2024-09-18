import { ModelStatic } from '@botmate/database';

import { Application } from '../application';
import { Bot } from '../bot/bot';
import { BotModel, initBotsModel } from '../models/bot';

export class BotManager {
  private _model: ModelStatic<BotModel>;
  private _bots: Map<string, Bot> = new Map();

  constructor(private app: Application) {
    this._model = initBotsModel(this.app.database.sequelize);
  }

  /**
   * `init` method initializes the bot manager loads all the added bots in the `_bots` map.
   */
  async init() {
    const allBots = await this._model.findAll();
    for (const bot of allBots) {
      const botInstance = new Bot(
        bot.platformType,
        bot.credentials as Record<string, string>,
        bot,
      );
      this._bots.set(bot.id, botInstance);
    }
  }

  async get(id: string) {
    return this._model.findByPk(id);
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
