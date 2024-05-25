import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Toaster } from 'sonner';

import { Application } from './application';
import Loader from './components/loader';

function AppProvider({ app }: { app: Application }) {
  const [router, setRouter] = useState<ReturnType<
    typeof createBrowserRouter
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    app.pluginManager.initialize().then(async () => {
      const plugins = app.pluginManager.plugins;

      for (const plugin of plugins) {
        if (plugin.clientPath) {
          const module = await import(/* @vite-ignore */ plugin.clientPath);
          const [key] = Object.keys(module);
          console.debug('loading plugin', key);
          const instance = new module[key](app);
          await instance.beforeLoad();
        }
      }

      const router = createBrowserRouter(app.routes);
      setRouter(router);
      setLoading(false);
    });
  }, [app]);

  if (!router) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default AppProvider;
