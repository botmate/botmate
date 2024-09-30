import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Plugin } from '../../plugin';
import { useApp } from '../hooks/app';
import useCurrentBot from '../hooks/bots';
import { trpc } from '../trpc';

function PluginsProvider() {
  const app = useApp();
  const bot = useCurrentBot();
  const [isLoading, setLoading] = useState('Loading...');
  const { data: plugins } = trpc.getLocalPlugins.useQuery(bot.platformType);
  const { data: botPlugins } = trpc.getBotPlugins.useQuery(bot._id);

  useEffect(() => {
    app.sidebar.length = 0;

    async function loadPlugins() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const plugin of botPlugins!) {
        try {
          const pluginData = plugins?.find((p) => p.name === plugin.name);
          if (!pluginData) {
            // the code should never reach here...
            console.error(`this should never be logged`);
            continue;
          }
          const module = await import(
            /* @vite-ignore */ `${pluginData?.clientPath}`
          );
          const [first] = Object.keys(module);
          const _Plugin = module[first];
          const i = new _Plugin(app, plugin) as Plugin;

          // run beforeLoad hook
          console.debug(`running beforeLoad hook for ${plugin.name}`);
          await i.beforeLoad();

          app.pluginInstances.set(pluginData?.name, i);
        } catch (error) {
          console.error('Error loading plugin', plugin.name, error);
        }
      }

      setLoading('');
    }

    if (plugins && botPlugins) {
      if (botPlugins.length > 0) {
        loadPlugins();
      } else {
        setLoading('');
      }
    }
  }, [plugins, botPlugins]);

  // const app = useApp();
  // const bot = useCurrentBot();

  // const { data: botPlugins } = useGetBotPluginsQuery(bot._id);

  // useEffect(() => {
  //   app.sidebar.length = 0;
  //   async function loadPlugins() {

  //     setLoading('');
  //   }

  //   if (plugins && botPlugins) {
  //     if (botPlugins.length > 0) {
  //       loadPlugins();
  //     } else {
  //       setLoading('');
  //     }
  //   }
  // }, [plugins, botPlugins]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="/logo.svg"
          alt="Loading..."
          className="w-16 h-16 animate-pulse rounded-2xl"
          draggable={false}
        />
      </div>
    );
  }

  return <Outlet />;
}

export default PluginsProvider;
