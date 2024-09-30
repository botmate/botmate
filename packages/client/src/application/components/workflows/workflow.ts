import { useMemo } from 'react';

import { trpc } from '../../trpc';

// todo: dynamic platform

export function useWorkflowEvents() {
  const { data } = trpc.getWorkflowEvents.useQuery('telegram');
  const events = useMemo(() => {
    return Object.entries(data || {}).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }, [data]);
  return events;
}

export function useWorkflowActions() {
  const { data } = trpc.getWorkflowActions.useQuery('telegram');
  const actions = useMemo(() => {
    return Object.entries(data || {}).map(([, value]) => ({
      ...value,
    }));
  }, [data]);
  return actions;
}
