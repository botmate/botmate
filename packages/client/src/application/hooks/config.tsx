/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useMemo, useState } from 'react';

import { trpc } from '../trpc';
import { useCurrentPlugin } from './plugins';

export function usePluginConfig<
  T = Record<string, string | number | boolean>,
>() {
  const plugin = useCurrentPlugin();
  const saveConfig = trpc.saveConfig.useMutation();

  const [config, setConfig] = useState<T>((plugin?.config || {}) as T);

  useEffect(() => {
    setConfig((plugin?.config || {}) as T);
  }, [plugin]);

  return useMemo(
    () => ({
      save: (key: keyof T, value: T[keyof T]) =>
        saveConfig
          .mutateAsync({
            pluginId: plugin!._id,
            key: key as string,
            value,
          })
          .then(() => {
            const newConfig = { ...config, [key]: value } as T;
            setConfig(newConfig);
          }),
      isSaving: saveConfig.isLoading,
      get: function (key: keyof T, def?: T[keyof T]) {
        const value = config?.[key] ?? def;
        return value as T[keyof T];
      },
    }),
    [config, plugin, saveConfig],
  );
}
