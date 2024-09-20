import { RouteObject } from 'react-router-dom';

import { IPlugin } from '@botmate/server';

import { Application, MainSidebarItem } from './application';

export abstract class Plugin {
  static displayName: string;

  loaded = false;

  async beforeLoad() {
    console.debug(`beforeLoad ${this.constructor.name}`);
  }

  async load() {
    console.debug(`load ${this.constructor.name}`);
  }

  async afterLoad() {
    console.debug(`afterLoad ${this.constructor.name}`);
  }

  constructor(private app: Application, private pluginData: IPlugin) {}

  get routes() {
    return this.app.routes;
  }

  /**
   * Add a route to the application
   * @param path
   * @param element
   */
  addRoute(route: RouteObject) {
    this.routes.push({
      ...route,
      _plugin: this.pluginData,
    });
  }

  /**
   * Add a sidebar item to the application
   * @param item SidebarItem
   */
  addToSidebar(item: MainSidebarItem) {
    this.app.sidebar.push(item);
  }

  /**
   * Provide settings for the plugin to be displayed in the settings page
   * @param element
   */
  provideSettings(element: React.ReactNode) {
    this.app.pluginSettings.set(this.pluginData.name, element);
  }

  /**
   *
   */
  provideWidgets() {
    //
  }

  /**
   * @internal
   */
  getSettingsPage() {
    return this.app.pluginSettings.get(this.pluginData.name);
  }
}
