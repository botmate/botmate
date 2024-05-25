import { Plugin } from '@botmate/client';

import LoginPage from './components/login-page';

export class AuthPlugin extends Plugin {
  async beforeLoad() {
    this.app.addRoute({
      path: '/login',
      Component: LoginPage,
    });
  }
}
