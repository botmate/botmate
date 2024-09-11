import { useSavePluginConfigMutation } from '../services';
import { useCurrentPlugin } from './use-plugins';

export function usePluginConfig() {
  const plugin = useCurrentPlugin();
  const [saveMutation, { isLoading }] = useSavePluginConfigMutation();

  const config = plugin?.config || {};

  return {
    save: (key: string, value: string) =>
      saveMutation({ pluginId: plugin!.id, key, value }).unwrap(),
    isSaving: isLoading,
    get: function <T = any>(key: string, def: T) {
      return (config?.[key] || def) as T;
    },
  };
}
