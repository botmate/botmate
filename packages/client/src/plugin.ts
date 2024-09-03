import { Application } from './application';

export abstract class Plugin {
  abstract displayName: string;

  beforeLoad() {}
  load() {}
  afterLoad() {}

  constructor(private app: Application) {}

  get routes() {
    return this.app.routes;
  }

  addRoute(path: string, element: React.ReactNode) {
    this.routes.push({ path, element });
  }
}
