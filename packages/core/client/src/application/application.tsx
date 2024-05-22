import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import NotFound from './components/not-found';
import { PluginManager } from './plugin-manager';

export class Application {
  private routes: RouteObject[] = [
    {
      path: '*',
      element: <NotFound />,
    },
  ];
  private pluginManager: PluginManager;

  constructor() {
    this.pluginManager = new PluginManager(this);
    this.pluginManager.initialize();
  }

  get addPlugin() {
    return this.pluginManager.add;
  }

  async getRootComponent() {
    const router = createBrowserRouter(this.routes);

    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }

  addRoute(route: RouteObject) {
    this.routes.unshift(route);
  }
}
