import type { WorkflowAction, WorkflowEvent } from '@botmate/platform';

import { baseApi } from '../api';

export const workflowsApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getWfEvents: builder.query<Record<string, WorkflowEvent>, string>({
      query: (platform) => '/workflows/events?platform=' + platform,
    }),
    getWfActions: builder.query<Record<string, WorkflowAction>, string>({
      query: (platform) => '/workflows/actions?platform=' + platform,
    }),
  }),
});

export const { useGetWfEventsQuery, useGetWfActionsQuery } = workflowsApi;
