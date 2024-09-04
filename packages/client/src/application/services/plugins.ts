import type { PluginMeta } from '@botmate/server';

import { baseApi } from '../api';

export const pluginsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPlugins: builder.query<PluginMeta[], void>({
      query: () => '/plugins',
    }),
  }),
});

export const { useGetPluginsQuery } = pluginsApi;
