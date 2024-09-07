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
