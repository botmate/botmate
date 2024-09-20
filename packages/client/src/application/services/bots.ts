import type { IBot } from '@botmate/server';

import { baseApi } from '../api';

export type CreateBotPayload = {
  platform: string;
  credentials: Record<string, string>;
};

export type WidgetMeta = {
  plugin: string;
  name: string;
  component: React.ReactNode;
  props: Record<string, unknown>;
};

export const botsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getBots: builder.query<IBot[], void>({
      query: () => '/bots',
      providesTags: ['Bots'],
    }),
    getBotInfo: builder.query<IBot, string>({
      query: (id) => `/bots/${id}`,
    }),
    getBotWidgets: builder.query<WidgetMeta[], string>({
      query: (id) => `/bots/${id}/widgets`,
    }),
    createBot: builder.mutation<IBot, CreateBotPayload>({
      query: (bot) => ({
        url: '/bots',
        method: 'POST',
        body: bot,
      }),
    }),
    deleteBot: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bots'],
    }),
  }),
});

export const {
  useGetBotsQuery,
  useGetBotInfoQuery,
  useCreateBotMutation,
  useDeleteBotMutation,
  useGetBotWidgetsQuery,
} = botsApi;
