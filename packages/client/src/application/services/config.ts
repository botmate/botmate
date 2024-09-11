import { baseApi } from '../api';

type SaveConfigRequest = {
  botId: string;
  key: string;
  value: string;
};

type GetConfigRequest = {
  botId: string;
  key: string;
};

export const configApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    saveConfig: builder.mutation<void, SaveConfigRequest>({
      query: (body) => ({
        url: '/config/save',
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getConfig: builder.mutation<string, GetConfigRequest>({
      query: (params) => ({
        url: '/config/get',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useSaveConfigMutation, useGetConfigMutation } = configApi;
