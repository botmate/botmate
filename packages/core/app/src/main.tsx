import * as ReactDOM from 'react-dom/client';

import { Application } from '@botmate/client';

const app = new Application();

async function run() {
  // if (import.meta.env.DEV) {
  //   const plugins = await import('./plugins');
  //   for (const name of Object.keys(plugins)) {
  //     console.log(`Loading plugin: ${name}`);
  //     try {
  //       // @ts-expect-error - This is a dynamic import
  //       await app.addPlugin(plugins[name], app);
  //     } catch (error) {
  //       console.error(`Failed to load plugin: ${name}`);
  //       console.error(error);
  //     }
  //   }
  // }

  app.getRootComponent().then((rootComponent) => {
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement,
    );
    root.render(rootComponent);
  });
}
run();
