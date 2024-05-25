import { Plugin } from '@botmate/server';

import { initModel } from './model';

export class UsersPlugin extends Plugin {
  async beforeLoad() {
    initModel(this.db);
  }
}
