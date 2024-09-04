import type { IBot } from '@botmate/server';

import { baseApi } from '../api';

export type CreateBotPayload = {
  platform: string;
  credentials: Record<string, string>;
};

export const botsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getBots: builder.query<IBot[], void>({
      query: () => '/bots',
    }),
    getBotInfo: builder.query<IBot, string>({
      query: (id) => `/bots/${id}`,
    }),
    createBot: builder.mutation<IBot, CreateBotPayload>({
      query: (bot) => ({
        url: '/bots',
        method: 'POST',
        body: bot,
      }),
    }),
  }),
});

export const { useGetBotsQuery, useGetBotInfoQuery, useCreateBotMutation } =
  botsApi;
