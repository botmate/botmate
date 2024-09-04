import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetPluginsQuery } from '../../../services/plugins';

function PluginSettingsPage() {
  const { data: plugins } = useGetPluginsQuery();
  const [searchParams] = useSearchParams();

  const plugin = plugins?.find(
    (plugin) => plugin.name === searchParams.get('plugin')
  );

  if (plugin)
    return (
      <div className="p-8 bg-card border-b">
        <div>
          <h1 className="text-xl">{plugin.displayName}</h1>
          <p className="text-gray-500 dark:text-neutral-500 mt-1">
            {plugin.description}
          </p>

          <p className="text-gray-600 dark:text-neutral-500 mt-4">
            Version: {plugin.version}
          </p>
        </div>
      </div>
    );
}

export default PluginSettingsPage;
