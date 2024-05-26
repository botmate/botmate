import * as ReactDOM from 'react-dom/client';

import { Application } from '@botmate/client';

const app = new Application();

async function run() {
  const { plugins } = await import('./plugins');
  for (const name of Object.keys(plugins)) {
    try {
      console.debug(`loading plugin: ${name}`);

      const Module = await plugins[name];
      const [key] = Object.keys(Module);
      if (!key) {
        console.warn(`Plugin ${name} does not export an export`);
        continue;
      }

      const Plugin = Module[key];
      await app.pluginManager.add(name, Plugin, app);
    } catch (error) {
      console.error(`Failed to load plugin: ${name}`);
      console.error(error);
    }
  }

  app.getRootComponent().then((rootComponent) => {
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement,
    );
    root.render(rootComponent);
  });
}
run();
