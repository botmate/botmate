import { ModelStatic } from '@botmate/database';

import { Application } from './application';
import { PluginModel, initPluginModel } from './models/plugin';

export class ConfigManager {
  private _pluginModel: ModelStatic<PluginModel>;

  constructor(private app: Application) {
    this._pluginModel = initPluginModel(this.app.database.sequelize);
  }

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
  ): Promise<T | null> {
    const plugin = await this._pluginModel.findOne({
      where: {
        id: pluginId,
      },
    });

    if (!plugin) {
      this.app.logger.error(`Plugin not found: ${pluginId}`);
      return null;
    }

    if (!plugin.config?.[key]) {
      this.app.logger.warn(`Config key not found: ${key}`);
      if (def !== undefined) {
        this.app.logger.warn(`Returning default value: ${def}`);
        return def;
      }
    }

    return plugin.config?.[key] as T;
  }
}
