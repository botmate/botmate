import { Plugin, loadable } from '@botmate/client';

const LoginPage = loadable(() => import('./components/login-page'));

export class AuthPlugin extends Plugin {
  async beforeLoad() {
    this.app.addRoute({
      path: '/login',
      Component: LoginPage,
    });
  }
}
