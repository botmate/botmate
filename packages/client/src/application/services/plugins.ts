import type { IPlugin, PluginMeta } from '@botmate/server';

import { baseApi } from '../api';

type InstallPluginPayload = {
  name: string;
  botId: string;
};
type UninstallPluginPayload = {
  name: string;
  botId: string;
};
type EnablePluginPayload = {
  name: string;
  botId: string;
};
type DisablePluginPayload = {
  name: string;
  botId: string;
};
export const pluginsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPlugins: builder.query<PluginMeta[], string>({
      query: (platform) => '/plugins?platform=' + platform,
      providesTags: ['Plugins'],
    }),
    getBotPlugins: builder.query<IPlugin[], string>({
      query: (botId) => `/plugins/bots?botId=${botId}`,
      providesTags: ['BotPlugins'],
    }),
    installPlugin: builder.mutation<PluginMeta, InstallPluginPayload>({
      query: ({ botId, name }) => ({
        url: `/plugins/install`,
        method: 'POST',
        body: { name, botId },
      }),
      invalidatesTags: ['BotPlugins'],
    }),
    uninstallPlugin: builder.mutation<PluginMeta, UninstallPluginPayload>({
      query: ({ botId, name }) => ({
        url: `/plugins/uninstall`,
        method: 'DELETE',
        body: { name, botId },
      }),
      invalidatesTags: ['BotPlugins'],
    }),
    enablePlugin: builder.mutation<PluginMeta, EnablePluginPayload>({
      query: ({ botId, name }) => ({
        url: `/plugins/enable`,
        method: 'POST',
        body: { name, botId },
      }),
      invalidatesTags: ['BotPlugins'],
    }),
    disablePlugin: builder.mutation<PluginMeta, DisablePluginPayload>({
      query: ({ botId, name }) => ({
        url: `/plugins/disable`,
        method: 'POST',
        body: { name, botId },
      }),
      invalidatesTags: ['BotPlugins'],
    }),
  }),
});

export const {
  useGetPluginsQuery,
  useGetBotPluginsQuery,
  useInstallPluginMutation,
  useUninstallPluginMutation,
  useEnablePluginMutation,
  useDisablePluginMutation,
} = pluginsApi;
