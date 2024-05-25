import { RouteObject } from 'react-router-dom';

import { PluginManager } from './plugin-manager';
import AppProvider from './provider';

export class Application {
  routes: RouteObject[] = [];
  pluginManager: PluginManager;

  constructor() {
    this.pluginManager = new PluginManager(this);
  }

  get addPlugin() {
    return this.pluginManager.add;
  }

  get plugins() {
    return this.pluginManager.plugins;
  }

  async getRootComponent() {
    return <AppProvider app={this} />;
  }

  addRoute(route: RouteObject) {
    this.routes.unshift(route);
  }
}
