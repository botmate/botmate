import { Application } from '../application';
import dev from './dev';
import pm from './pm';
import start from './start';

export function registerCLI(app: Application) {
  start(app);
  dev(app);
  pm(app);
}
