import React, { useEffect } from 'react';

import { Application } from './application';
import { PluginManager } from './plugin-manager';

function PluginsProvider({
  pm,
  app,
  children,
}: {
  app: Application;
  children: React.ReactNode;
  pm: PluginManager;
}) {
  useEffect(() => {
    pm.initialize().then(async () => {
      const { __federation_method_getRemote } =
        // @ts-expect-error - this is a dynamic import
        await import(/* @vite-ignore */ '__federation__');
      // __federation_method_setRemote(
      //   'remote',
      //   'http://localhost:4173/assets/remoteEntry.js',
      // );

      const plugin = await __federation_method_getRemote(
        'remoteApp',
        '@botmate/plugin-auth',
      );
      const instance = new plugin.AuthPlugin(app);
      await instance.beforeLoad();
      console.log('instance', instance);
      // const i = new p(app);
      // i.beforeLoad();

      // const plugins = pm.plugins;
      // for (const plugin of plugins) {
      // }
    });
  }, [pm]);
  return <>{children}</>;
}

export default PluginsProvider;
