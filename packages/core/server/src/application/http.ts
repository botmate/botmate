import { bodyParser } from '@koa/bodyparser';
import Router from '@koa/router';
import koa from 'koa';

export class Http {
  app: koa;
  router = new Router({
    prefix: '/api',
  });

  constructor() {
    this.app = new koa();

    this.app.use(bodyParser());
  }

  public listen(port: number) {
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    this.app.listen(port);
  }
}
