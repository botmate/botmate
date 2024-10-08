import { createLogger, winston } from '@botmate/logger';

import { Application } from './application';
import { PluginModel } from './models/plugins.model';

export class ConfigManager {
  logger: winston.Logger = createLogger({ name: ConfigManager.name });

  constructor(private app: Application) {
    // this._pluginModel = initPluginModel(this.app.database.sequelize);
  }

  async savePluginConfig<T = unknown>(pluginId: string, key: string, value: T) {
    const plugin = await PluginModel.findById(pluginId);

    if (!plugin) {
      this.logger.error(`Plugin not found: ${pluginId}`);
      return;
    }

    const config = plugin.config || {};

    config[key] = value;

    await PluginModel.findOneAndUpdate(
      {
        _id: pluginId,
      },
      {
        config,
      },
    );
  }

  async getPluginConfig<T = unknown>(
    pluginId: string,
    key: string,
    def?: T,
  ): Promise<T | null> {
    const plugin = await PluginModel.findById(pluginId);

    if (!plugin) {
      this.logger.error(`Plugin not found: ${pluginId}`);
      return null;
    }

    if (!plugin.config?.[key]) {
      if (def !== undefined) {
        return def;
      }
    }

    return plugin.config?.[key] as T;
  }
}
