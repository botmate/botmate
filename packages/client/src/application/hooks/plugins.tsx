/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useSelector } from 'react-redux';

import { selectCurrentPlugin } from '../reducers/plugins';
import { trpc } from '../trpc';
import useCurrentBot from './bots';

export function usePlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = trpc.getLocalPlugins.useQuery(bot.platformType);
  return plugins || [];
}

export function useBotPlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = trpc.getBotPlugins.useQuery(bot.id);
  return plugins || [];
}

/**
 * Returns currently active plugin on the dashboard, either from the Settings or from the navigation.
 */
export function useCurrentPlugin() {
  const plugin = useSelector(selectCurrentPlugin);
  return plugin!;
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function usePluginRPC<T extends Record<string, (params?: any) => any>>(
  name: keyof T,
  params?: Parameters<T[typeof name]>[0],
) {
  const bot = useCurrentBot();
  const plugin = useCurrentPlugin();
  const { data: store } = trpc.invokePluginRPCQuery.useQuery({
    botId: bot.id, // todo: make this to use _id
    pluginName: plugin.name,
    name: name as string,
    params,
  });

  return store as UnwrapPromise<ReturnType<T[typeof name]>> | undefined;
}
//   const bot = useCurrentBot();

export function usePluginRPCMutation<
  T extends Record<string, (params?: any) => any>,
>(name: keyof T) {
  const bot = useCurrentBot();
  const plugin = useCurrentPlugin();
  const invoke = trpc.invokePluginRPCMutation.useMutation();
  return {
    mutateAsync: async (params?: Parameters<T[typeof name]>[0]) => {
      return invoke.mutateAsync({
        botId: bot.id,
        pluginName: plugin.name,
        name: name as string,
        params,
      }) as UnwrapPromise<ReturnType<T[typeof name]>> | undefined;
    },
    isLoading: invoke.isLoading,
  };
}
