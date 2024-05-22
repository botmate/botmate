import { Application } from './application/application';

export class Plugin {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async beforeLoad() {
    const name = this.constructor.name;
    console.warn(`[${name}] beforeLoad is not implemented`);
  }
  async load() {
    const name = this.constructor.name;
    console.warn(`[${name}] load is not implemented`);
  }
}
