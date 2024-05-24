import { RouteObject } from 'react-router-dom';

import NotFound from './components/not-found';
import { PluginManager } from './plugin-manager';
import AppProvider from './provider';

export class Application {
  routes: RouteObject[] = [
    {
      path: '*',
      element: <NotFound />,
    },
  ];
  pluginManager: PluginManager;

  constructor() {
    this.pluginManager = new PluginManager(this);
  }

  get addPlugin() {
    return this.pluginManager.add;
  }

  async getRootComponent() {
    return <AppProvider app={this} />;
  }

  addRoute(route: RouteObject) {
    this.routes.unshift(route);
  }
}
