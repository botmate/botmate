import { baseApi } from '../api';

type SavePluginConfigRequest = {
  pluginId: string;
  key: string;
  value: string;
};

type GetPluginConfigRequest = {
  pluginId: string;
  key: string;
};

export const configApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    savePluginConfig: builder.mutation<void, SavePluginConfigRequest>({
      query: (body) => ({
        url: '/config/plugin/save',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getPluginConfig: builder.mutation<string, GetPluginConfigRequest>({
      query: (params) => ({
        url: '/config/plugin/get',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useSavePluginConfigMutation, useGetPluginConfigMutation } =
  configApi;
