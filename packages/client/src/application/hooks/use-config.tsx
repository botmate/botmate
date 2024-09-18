/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useMemo, useState } from 'react';

import { useSavePluginConfigMutation } from '../services';
import { useCurrentPlugin } from './use-plugins';

export function usePluginConfig<
  T = Record<string, string | number | boolean>,
>() {
  const plugin = useCurrentPlugin();
  const [saveMutation, { isLoading }] = useSavePluginConfigMutation();

  const [config, setConfig] = useState<T>((plugin?.config || {}) as T);

  useEffect(() => {
    setConfig((plugin?.config || {}) as T);
  }, [plugin]);

  return useMemo(
    () => ({
      save: (key: keyof T, value: T[keyof T]) =>
        saveMutation({
          pluginId: plugin!.id,
          key: key as string,
          value,
        })
          .unwrap()
          .then(() => {
            const newConfig = { ...config, [key]: value } as T;
            setConfig(newConfig);
          }),
      isSaving: isLoading,
      get: function (key: keyof T, def?: T[keyof T]) {
        const value = config?.[key] ?? def;
        return value as T[keyof T];
      },
    }),
    [config, plugin, saveMutation, isLoading],
  );
}
