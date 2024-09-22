import { Application } from './application';

new Application({
  dbString: process.env.DATABASE_URL as string,
}).cli.parseAsync(process.argv);
