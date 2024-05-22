import { bodyParser } from '@koa/bodyparser';
import Router from '@koa/router';
import koa from 'koa';
import koaStatic from 'koa-static';

export class Http {
  app: koa;
  router = new Router({
    prefix: '/api',
  });

  constructor() {
    this.app = new koa();

    this.app.use(bodyParser());
    this.app.use(koaStatic('public'));
  }

  public listen(port: number) {
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    this.app.listen(port);
  }
}
