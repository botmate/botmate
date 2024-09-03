import type { BotModel } from '@botmate/server';

import { baseApi } from '../api';

export type CreateBotPayload = {
  platform: string;
  credentials: Record<string, string>;
};

export const botsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getBots: builder.query<BotModel[], void>({
      query: () => '/bots',
    }),
    getBotInfo: builder.query<BotModel, string>({
      query: (id) => `/bots/${id}`,
    }),
    createBot: builder.mutation<BotModel, CreateBotPayload>({
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
