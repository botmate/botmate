/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from './client';

export class Plugin {
  constructor(protected app: Application) {}

  async beforeLoad() {}
  async load() {}
}
