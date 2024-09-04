import { Application } from './application';

export abstract class Plugin {
  abstract displayName: string;

  loaded = false;

  async beforeLoad() {}
  async load() {}
  async afterLoad() {}

  constructor(private app: Application) {}

  get routes() {
    return this.app.routes;
  }

  addRoute(path: string, element: React.ReactNode) {
    this.routes.push({ path, element });
  }

  setSettingsPage(element: React.ReactNode) {
    this.app.settingsPage[this.displayName] = element;
  }

  getSettingsPage() {
    if (this.app.settingsPage[this.displayName]) {
      return this.app.settingsPage[this.displayName];
    }

    return null;
  }
}
