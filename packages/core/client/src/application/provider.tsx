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
      console.log('plugins', plugins);
      // const { __federation_method_getRemote } =
      //   // @ts-expect-error - this is a dynamic import
      //   await import('__federation__');
      // for (const plugin of plugins) {
      //   const remotePlugin = await __federation_method_getRemote(
      //     'remoteApp',
      //     plugin.name,
      //   );
      //   const [key] = Object.keys(remotePlugin);
      //   const instance = new remotePlugin[key](app);
      //   console.debug('Running beforeLoad for plugin:', key);
      //   await instance.beforeLoad();
      // }
      const router = createBrowserRouter(app.routes);
      setRouter(router);
      setLoading(false);
    });
  }, [app.pluginManager, app.routes]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!router) {
    return (
      <div className="h-screen flex justify-center items-center">
        No router found
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
