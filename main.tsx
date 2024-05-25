import * as ReactDOM from 'react-dom/client';

import { Application } from '@botmate/client';
import '@botmate/ui';

const app = new Application();

app.getRootComponent().then((rootComponent) => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );
  root.render(rootComponent);
});
