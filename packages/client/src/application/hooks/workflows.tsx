import { useMemo } from 'react';

import { trpc } from '../trpc';
import useCurrentBot from './bots';

export function useBotWorkflows() {
  const bot = useCurrentBot();
  const { data: workflows, isLoading } = trpc.listWorkflows.useQuery(bot.id);
  return {
    data: workflows ?? [],
    isLoading,
  };
}

export function useWorkflowEvents() {
  const { data } = trpc.getWorkflowEvents.useQuery('telegram');
  const events = useMemo(() => {
    return data || [];
  }, [data]);
  return events;
}

export function useWorkflowActions() {
  const { data } = trpc.getWorkflowActions.useQuery('telegram');
  const actions = useMemo(() => {
    return data || [];
  }, [data]);
  return actions;
}
