import koa from 'koa';

export class Http {
  private app: koa;

  constructor() {
    this.app = new koa();
  }

  public listen(port: number) {
    this.app.listen(port);
  }
}
