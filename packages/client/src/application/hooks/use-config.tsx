import { useSaveConfigMutation } from '../services';
import useCurrentBot from './use-bot';

export function useBotConfig(botId?: string) {
  const { id, config } = useCurrentBot();

  const [saveMutation, { isLoading }] = useSaveConfigMutation();

  if (!botId) {
    botId = id;
  }

  return {
    save: (key: string, value: string) =>
      saveMutation({ botId, key, value }).unwrap(),
    isSaving: isLoading,
    get: function <T = any>(key: string, def: T) {
      return (config?.[key] || def) as T;
    },
  };
}
