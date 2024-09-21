import { useSelector } from 'react-redux';

import { selectCurrentPlugin } from '../reducers/plugins';
import { useGetBotPluginsQuery } from '../services/plugins';
import { trpc } from '../trpc';
import useCurrentBot from './use-bot';

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
  return plugin;
}
