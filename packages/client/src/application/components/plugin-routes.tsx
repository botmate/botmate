import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useApp } from '../hooks/use-app';
import PageNotFound from './404';

/**
 * This component is responsible for setting up the routes for the plugins.
 * @returns
 */
function PluginRoutes() {
  const app = useApp();
  const [routes, setRoutes] = React.useState<React.ReactNode[]>([]);

  useEffect(() => {
    app.routes.forEach((item, index) => {
      setRoutes((prev) => [
        ...prev,
        <Route key={index} path={item.path} element={item.element} />,
      ]);
    });
  }, []);

  return (
    <Routes>
      {routes}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default PluginRoutes;
