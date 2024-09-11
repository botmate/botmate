import { Application } from './application';
import { initBotsModel } from './models/bot';
import { initPluginModel } from './models/plugin';

export class ConfigManager {
  constructor(private app: Application) {}

  private _botModel = initBotsModel(this.app.database.sequelize);
  private _pluginModel = initPluginModel(this.app.database.sequelize);

  async savePluginConfig<T = any>(pluginId: string, key: string, value: T) {
    this.app.logger.debug(`Saving config key: ${key}`);

    const plugin = await this._pluginModel.findOne({
      where: {
        id: pluginId,
      },
    });

    if (!plugin) {
      this.app.logger.error(`Plugin not found: ${pluginId}`);
      return;
    }

    const config = plugin.config || {};

    config[key] = value;

    await this._pluginModel.update(
      {
        config,
      },
      {
        where: {
          id: pluginId,
        },
      },
    );
  }

  async getPluginConfig<T = any>(
    pluginId: string,
    key: string,
    def?: T,
  ): Promise<T> {
    this.app.logger.debug(`Getting config key: ${key}`);

    const plugin = await this._pluginModel.findOne({
      where: {
        id: pluginId,
      },
    });

    if (!plugin) {
      this.app.logger.error(`Plugin not found: ${pluginId}`);
      throw new Error(`Plugin not found: ${pluginId}`);
    }

    if (!plugin.config?.[key]) {
      this.app.logger.debug(`Config key not found: ${key}`);
      if (def !== undefined) {
        this.app.logger.debug(`Returning default value: ${def}`);
        return def;
      }
    }

    return plugin.config?.[key] as T;
  }
}
