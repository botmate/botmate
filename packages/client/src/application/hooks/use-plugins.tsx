import { useSelector } from 'react-redux';

import { selectCurrentPlugin } from '../reducers/plugins';
import { useGetBotPluginsQuery, useGetPluginsQuery } from '../services/plugins';
import useCurrentBot from './use-bot';

export function usePlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = useGetPluginsQuery(bot.platformType);
  return plugins || [];
}

export function useBotPlugins() {
  const bot = useCurrentBot();
  const { data: plugins } = useGetBotPluginsQuery(bot.id);
  return plugins || [];
}

/**
 * Returns currently active plugin on the dashboard, either from the Settings or from the navigation.
 */
export function useCurrentPlugin() {
  const plugin = useSelector(selectCurrentPlugin);
  return plugin;
}
