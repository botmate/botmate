import { Plugin, loadable } from '@botmate/client';

const UsersPage = loadable(() => import('./components/users-page'));

export class UsersPlugin extends Plugin {
  async beforeLoad() {
    this.app.addRoute({
      path: '/users',
      Component: UsersPage,
    });
  }
}
