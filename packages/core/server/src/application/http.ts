import { createLogger } from '@botmate/utils';
import { bodyParser } from '@koa/bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import koa from 'koa';
import koaLogger from 'koa-logger';
import serve from 'koa-static';
import { join } from 'path';

export class Http {
  app: koa;
  router = new Router({
    prefix: '/api',
  });

  constructor(private isDev = true) {
    this.app = new koa();
    const logger = createLogger('http');

    this.app.use(cors());
    this.app.use(
      koaLogger({
        transporter(str, args) {
          logger.debug(str, {
            args,
          });
        },
      }),
    );
    this.router.use(bodyParser());

    if (this.isDev) {
      this.app.use(serve(join(__dirname, 'dist')));
    }
  }

  public listen(port: number) {
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    this.app.listen(port);
  }
}
