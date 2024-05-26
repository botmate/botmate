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
        try {
          const instance = app.pluginManager.getInstance(plugin.name);
          if (instance) {
            await instance.beforeLoad();
          }
        } catch (error) {
          console.error('failed to load plugin', plugin.name, error);
        }
      }

      const router = createBrowserRouter([...app.routes, notFoundRoute]);
      setRouter(router);
      setLoading(false);
    });
  }, [app]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default AppProvider;
