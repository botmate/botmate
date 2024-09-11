import { useSearchParams } from 'react-router-dom';

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

export function useCurrentPlugin() {
  // todo: better way to get current plugin
  const plugins = useBotPlugins();
  const [searchParams] = useSearchParams();

  const name = searchParams.get('name');
  return plugins.find((p) => p.name === name);
}
