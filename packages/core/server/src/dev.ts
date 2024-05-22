import { Application } from './application';

async function runApp() {
  const app = new Application();
  await app.initialize();
  await app.start();
}

runApp();
