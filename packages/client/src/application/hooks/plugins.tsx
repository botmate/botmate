/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useSelector } from 'react-redux';

import { selectCurrentPlugin } from '../reducers/plugins';
import { trpc } from '../trpc';
import useCurrentBot from './bots';

/**
 * Custom hook to retrieve the list of local plugins for the current bot.
 *
 * This hook uses the `useCurrentBot` hook to get the current bot's information
 * and then fetches the local plugins associated with the bot's platform type.
 *
 * @returns An array of local plugins. If no plugins are found, an empty array is returned.
 */
export function usePlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = trpc.getLocalPlugins.useQuery(bot.platformType);
  return plugins || [];
}

/**
 * Custom hook to fetch and return the plugins associated with the current bot.
 * @returns An array of plugins associated with the current bot. If no plugins are found, returns an empty array.
 */
export function useBotPlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = trpc.getBotPlugins.useQuery(bot._id);
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

/**
 * @deprecated Use `createPluginRPC` instead.
 */
export function usePluginRPC<T extends Record<string, (params?: any) => any>>(
  name: keyof T,
  params?: Parameters<T[typeof name]>[0],
) {
  const bot = useCurrentBot();
  const plugin = useCurrentPlugin();
  const { data: store } = trpc.invokePluginRPCQuery.useQuery({
    botId: bot._id, // todo: make this to use _id
    pluginName: plugin.name,
    name: name as string,
    params,
  });

  return store as UnwrapPromise<ReturnType<T[typeof name]>> | undefined;
}
//   const bot = useCurrentBot();

/**
 * @deprecated Use `createPluginRPC` instead.
 */
export function usePluginRPCMutation<
  T extends Record<string, (params?: any) => any>,
>(name: keyof T) {
  const bot = useCurrentBot();
  const plugin = useCurrentPlugin();
  const invoke = trpc.invokePluginRPCMutation.useMutation();
  return {
    mutateAsync: async (params?: Parameters<T[typeof name]>[0]) => {
      return invoke.mutateAsync({
        botId: bot._id,
        pluginName: plugin.name,
        name: name as string,
        params,
      }) as UnwrapPromise<ReturnType<T[typeof name]>> | undefined;
    },
    isLoading: invoke.isLoading,
  };
}

/**
 * Creates a proxy object that provides `useQuery` and `useMutation` hooks for invoking plugin RPC methods.
 *
 * @template T - Type import of RPC from the server.
 *
 * @returns An object with keys as RPC method names and values as objects with:
 * - `useQuery`: A hook to query data from the RPC method.
 * - `useMutation`: A hook to mutate data using the RPC method.
 *
 * Example usage:
 * ```typescript
 * const pluginRPC = createPluginRPC<RPC>();
 *
 * // inside a React component
 * function MyComponent() {
 *  const data = pluginRPC.someMethod.useQuery(param1, param2);
 *  const mutate = pluginRPC.someMethod.useMutation();
 *  await mutate.mutateAsync(param);
 * }
 * ```
 */
export function createPluginRPC<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, (params?: any) => any>,
>() {
  return new Proxy(
    {},
    {
      get(_, methodName: string) {
        return {
          useQuery: (...params: Parameters<T[typeof methodName]>) => {
            const bot = useCurrentBot();
            const plugin = useCurrentPlugin();

            const q = trpc.invokePluginRPCQuery.useQuery({
              botId: bot._id,
              pluginName: plugin.name,
              name: methodName,
              params,
            });
            return q.data;
          },
          useMutation: () => ({
            mutateAsync: async (
              params?: Parameters<T[typeof methodName]>[0],
            ) => {
              const bot = useCurrentBot();
              const plugin = useCurrentPlugin();
              const response = await trpc.invokePluginRPCMutation
                .useMutation()
                .mutateAsync({
                  botId: bot._id,
                  pluginName: plugin.name,
                  name: methodName,
                  params,
                });
              return response;
            },
          }),
        };
      },
    },
  ) as {
    [K in keyof T]: {
      useQuery: (
        ...args: Parameters<T[K]>
      ) => UnwrapPromise<ReturnType<T[K]>> | undefined;
      useMutation: () => {
        mutateAsync: (
          params?: Parameters<T[K]>[0],
        ) => UnwrapPromise<ReturnType<T[K]>> | undefined;
        isLoading: boolean;
      };
    };
  };
}
