import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { useTheme } from 'next-themes';

import { Application } from '../application';
import Loader from '../components/loader';
import { appContext } from '../context';
import MainLayout from '../layouts/main';
import { useGetBotInfoQuery } from '../services';
import { useGetPluginsQuery } from '../services/plugins';

type Props = {
  app: Application;
};
export function AppProvider({ app }: Props) {
  const params = useParams();

  const {
    isLoading,
    isError,
    data: botInfo,
  } = useGetBotInfoQuery(params.id as string, {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
  });

  const [loading, setLoading] = React.useState(true);
  const { data: plugins } = useGetPluginsQuery();

  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (botInfo) {
      app.bot = botInfo;
    }
  }, [botInfo]);

  useEffect(() => {
    async function loadPlugins() {
      await app.pluginManager.fetchPlugins(params.id as string);
      setLoading(false);
    }
    if (plugins?.length) loadPlugins();
  }, [plugins, params.id]);

  if (isLoading || loading) {
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

  if (!isError)
    return (
      <appContext.Provider value={app}>
        <Loader app={app} />
        <MainLayout>
          <Outlet />
        </MainLayout>
      </appContext.Provider>
    );
}
