import { Application } from './application';
import { initBotsModel } from './models/bot';

export class BotConfigManager {
  constructor(private app: Application) {}

  private _model = initBotsModel(this.app.database.sequelize);

  async save<T = any>(botId: number, key: string, value: T) {
    this.app.logger.debug(`Saving config key: ${key}`);

    const bot = await this._model.findOne({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      this.app.logger.error(`Bot not found: ${botId}`);
      return;
    }

    const config = bot.config || {};

    config[key] = value;

    await this._model.update(
      {
        config,
      },
      {
        where: {
          id: botId,
        },
      },
    );
  }

  async get<T = any>(botId: number, key: string): Promise<T | null> {
    this.app.logger.debug(`Getting config key: ${key}`);

    const bot = await this._model.findOne({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      this.app.logger.error(`Bot not found: ${botId}`);
      return null;
    }

    if (!bot.config?.[key]) {
      return null;
    }

    return bot.config?.[key] as T;
  }
}
