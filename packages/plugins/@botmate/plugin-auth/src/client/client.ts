import { Plugin } from '@botmate/client';

import LoginPage from './components/LoginPage';

export class AuthPlugin extends Plugin {
  async beforeLoad() {
    this.app.addRoute({
      path: '/login',
      Component: LoginPage,
    });
  }
}
