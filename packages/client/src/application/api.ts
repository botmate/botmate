import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
  tagTypes: ['Plugins', 'BotPlugins'],
});

export class Api {
  async get<TResponse = any>(url: string) {
    const res = await fetch(`/api${url}`);
    return (await res.json()) as TResponse;
  }

  async post(url: string, data: any) {
    const res = await fetch(`/api/${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  }
}
