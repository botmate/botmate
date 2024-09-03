import { Application } from '../application';
import pm from './pm';
import start from './start';

export function registerCLI(app: Application) {
  start(app);
  pm(app);
}
