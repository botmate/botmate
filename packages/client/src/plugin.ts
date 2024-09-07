import { IPlugin } from '@botmate/server';

import { Application } from './application';

export abstract class Plugin {
  abstract displayName: string;

  loaded = false;

  async beforeLoad() {}
  async load() {}
  async afterLoad() {}

  constructor(
    private app: Application,
    private pluginData: IPlugin,
  ) {}

  get routes() {
    return this.app.routes;
  }

  addRoute(path: string, element: React.ReactNode) {
    this.routes.push({ path, element });
  }

  provideSettings(element: React.ReactNode) {
    this.app.pluginSettings.set(this.pluginData.name, element);
  }

  getSettingsPage() {
    return this.app.pluginSettings.get(this.pluginData.name);
  }
}
