import { Plugin } from '@botmate/client';

import UsersPage from './components/users-page';

export class UsersPlugin extends Plugin {
  async beforeLoad() {
    this.app.addRoute({
      path: '/users',
      Component: UsersPage,
    });
  }
}
