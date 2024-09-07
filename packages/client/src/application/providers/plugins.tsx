import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Plugin } from '../../plugin';
import { useApp } from '../hooks/use-app';
import useCurrentBot from '../hooks/use-bot';
import { useGetBotPluginsQuery, useGetPluginsQuery } from '../services/plugins';

function PluginsProvider() {
  const app = useApp();
  const bot = useCurrentBot();

  const [isLoading, setLoading] = useState('Loading...');
  const { data: plugins } = useGetPluginsQuery(bot.platformType);
  const { data: botPlugins } = useGetBotPluginsQuery(bot.id);

  useEffect(() => {
    async function loadPlugins() {
      for (const plugin of botPlugins!) {
        try {
          const pluginData = plugins?.find((p) => p.name === plugin.name);
          const module = await import(`${pluginData?.clientPath}`);
          const [first] = Object.keys(module);
          const _Plugin = module[first];
          const i = new _Plugin(app, plugin) as Plugin;

          // run beforeLoad hook
          console.debug(`running beforeLoad hook for ${plugin.name}`);
          await i.beforeLoad();
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
