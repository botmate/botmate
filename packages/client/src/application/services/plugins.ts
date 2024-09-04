import type { IPlugin } from '@botmate/server';

import { baseApi } from '../api';

export const pluginsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPlugins: builder.query<IPlugin[], void>({
      query: () => '/plugins'
    })
  })
});

export const { useGetPluginsQuery } = pluginsApi;
