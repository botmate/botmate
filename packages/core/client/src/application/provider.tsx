import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Toaster } from 'sonner';

import { Application } from './application';
import Loader from './components/loader';
import NotFoundPage from './components/not-found';

const notFoundRoute = {
  path: '*',
  element: <NotFoundPage />,
};

function AppProvider({ app }: { app: Application }) {
  const [loading, setLoading] = useState(true);
  const [router, setRouter] = useState(createBrowserRouter([notFoundRoute]));

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

      const router = createBrowserRouter([...app.routes, notFoundRoute]);
      setRouter(router);
      setLoading(false);
    });
  }, [app]);

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
