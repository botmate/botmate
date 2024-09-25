import { PlatformType } from '@botmate/platform';
import { z } from 'zod';

import { Application } from '../application';
import { PluginModel } from '../models/plugins.model';
import { publicProcedure } from './_trpc';

export class PluginsService {
  constructor(private app: Application) {}

  async getLocalPlugins(platform: PlatformType) {
    const plugins = await this.app.pluginManager.getPlugins(platform);
    return plugins;
  }

  async getBotPlugins(botId: string) {
    const plugins = await PluginModel.find({ botId: botId });
    return plugins.map((plugin) => plugin.toObject());
  }

  async installPlugin(name: string, botId: string) {
    await this.app.pluginManager.install(name, botId);
  }

  async enablePlugin(name: string, botId: string) {
    await this.app.pluginManager.enable(name, botId);
  }

  async disablePlugin(name: string, botId: string) {
    await this.app.pluginManager.disable(name, botId);
  }

  async uninstallPlugin(name: string, botId: string) {
    await this.app.pluginManager.uninstall(name, botId);
  }

  async saveConfig(pluginId: string, key: string, value: unknown) {
    await this.app.configManager.savePluginConfig(pluginId, key, value);
  }

  async getConfig(pluginId: string, key: string, value: unknown) {
    await this.app.configManager.getPluginConfig(pluginId, key, value);
  }

  getRoutes() {
    return {
      getLocalPlugins: publicProcedure.input(z.string()).query(({ input }) => {
        return this.getLocalPlugins(input as PlatformType);
      }),
      /**
       * Get installed plugins for a bot
       */
      getBotPlugins: publicProcedure.input(z.string()).query(({ input }) => {
        return this.getBotPlugins(input);
      }),
      installPlugin: publicProcedure
        .input(
          z.object({
            name: z.string(),
            botId: z.string(),
          }),
        )
        .mutation(({ input }) => {
          return this.installPlugin(input.name, input.botId);
        }),
      enablePlugin: publicProcedure
        .input(
          z.object({
            name: z.string(),
            botId: z.string(),
          }),
        )
        .mutation(({ input }) => {
          return this.enablePlugin(input.name, input.botId);
        }),
      disablePlugin: publicProcedure
        .input(
          z.object({
            name: z.string(),
            botId: z.string(),
          }),
        )
        .mutation(({ input }) => {
          return this.disablePlugin(input.name, input.botId);
        }),
      uninstallPlugin: publicProcedure
        .input(
          z.object({
            name: z.string(),
            botId: z.string(),
          }),
        )
        .mutation(({ input }) => {
          return this.uninstallPlugin(input.name, input.botId);
        }),

      saveConfig: publicProcedure
        .input(
          z.object({
            pluginId: z.string(),
            key: z.string(),
            value: z.unknown(),
          }),
        )
        .mutation(({ input }) => {
          return this.saveConfig(input.pluginId, input.key, input.value);
        }),
      getConfig: publicProcedure
        .input(
          z.object({
            pluginId: z.string(),
            key: z.string(),
            value: z.unknown(),
          }),
        )
        .query(({ input }) => {
          return this.getConfig(input.pluginId, input.key, input.value);
        }),
    };
  }
}
