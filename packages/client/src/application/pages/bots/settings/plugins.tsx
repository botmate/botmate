import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Badge } from '@botmate/ui';

import { useApp } from '../../../hooks/use-app';
import { useGetPluginsQuery } from '../../../services/plugins';

function PluginSettingsPage() {
  const app = useApp();
  const [searchParams] = useSearchParams();
  const { data: plugins } = useGetPluginsQuery();

  const plugin = plugins?.find(
    (plugin) => plugin.name === searchParams.get('name'),
  );

  const isInstalled = useCallback(
    (name: string) => {
      return app.pluginManager.installedPlugins.some(
        (plugin) => plugin.name === name,
      );
    },
    [plugins],
  );

  if (plugin) {
    const pluginInstance = app.pluginManager.instances.get(plugin.name);
    const settingsPage = pluginInstance?.getSettingsPage();
    return (
      <div>
        <div className="p-8 bg-card border-b flex justify-between items-start relative">
          <div>
            <h1 className="text-xl">{plugin.displayName}</h1>
            <p className="text-gray-500 dark:text-neutral-500 mt-1">
              {plugin.description}
            </p>
          </div>
        </div>

        <div>
          <div className="px-8 py-4 border-b w-full bg-card/80">
            <div className="flex gap-2 items-center">
              <Badge
                className="cursor-pointer"
                onClick={async () => {
                  if (pluginInstance) {
                  }
                  await app.pluginManager.install(plugin.name);

                  window.location.reload();
                }}
              >
                click to{' '}
                {isInstalled(plugin.name)
                  ? pluginInstance?.loaded
                    ? 'disable'
                    : 'enable'
                  : 'install'}
              </Badge>
              {/* {plugin.installed && <Badge variant="outline">installed</Badge>} */}
              <Badge variant="outline">v{plugin.version}</Badge>
              <Badge variant="outline">latest</Badge>
              <div className="flex-1" />
              {isInstalled(plugin.name) && (
                <Badge
                  variant="danger"
                  className="bg-red-500 text-white cursor-pointer hover:bg-red-400"
                  onClick={async () => {
                    await app.pluginManager.uninstall(plugin.name);
                    window.location.reload();
                  }}
                >
                  uninstall
                </Badge>
              )}
            </div>
          </div>

          <div className="p-8">{settingsPage}</div>
          {/* <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">README.md</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs> */}
        </div>
      </div>
    );
  }
}

export default PluginSettingsPage;
