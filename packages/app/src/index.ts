import { Application } from '@botmate/server';
import 'dotenv/config';

import { getConfig } from './config';

const app = new Application();

getConfig().then((config) => {
  app.init(config);
});
