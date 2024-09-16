import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { useApp } from '../hooks/use-app';
import { useCurrentPlugin } from '../hooks/use-plugins';
import { setCurrentPlugin } from '../reducers/plugins';
import PageNotFound from './404';

/**
 * This component is responsible for setting up the routes for the plugins.
 * @returns
 */
function PluginRoutes() {
  const app = useApp();
  const [routes, setRoutes] = React.useState<React.ReactNode[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    app.routes.forEach((item, index) => {
      // Create a new element for the route for handling mounting and unmounting of the plugin
      const Element = () => {
        const currentPlugin = useCurrentPlugin();
        const dispatch = useDispatch();
        useEffect(() => {
          dispatch(setCurrentPlugin(item._plugin));
          return () => {
            dispatch(setCurrentPlugin(null));
          };
        }, []);
        return currentPlugin ? item.element : null;
      };

      setRoutes((prev) => [
        ...prev,
        <Route key={index} path={item.path} element={<Element />} />,
      ]);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center flex-1">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <Routes>
      {routes}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default PluginRoutes;
