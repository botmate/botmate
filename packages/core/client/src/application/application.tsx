import { RouteObject } from 'react-router-dom';

import { ApplicationContext } from './context';
import { PluginManager } from './plugin-manager';
import AppProvider from './provider';

export class Application {
  routes: RouteObject[] = [];
  pluginManager: PluginManager;

  constructor() {
    this.pluginManager = new PluginManager(this);
  }

  get plugins() {
    return this.pluginManager.plugins;
  }

  addRoute(route: RouteObject) {
    this.routes.unshift(route);
  }

  async getRootComponent() {
    return (
      <ApplicationContext.Provider value={this}>
        <AppProvider app={this} />
      </ApplicationContext.Provider>
    );
  }
}
