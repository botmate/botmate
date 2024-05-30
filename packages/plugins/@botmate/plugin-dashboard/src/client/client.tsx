import { Plugin, Route, Routes } from '@botmate/client';
import { HomeIcon } from '@botmate/icons';
import { SidebarItem } from '@botmate/types';

import Layout from './components/layout';

export class DashboardPlugin extends Plugin {
  priority = 1;

  async beforeLoad() {
    this.app.registerNamespace('sidebar/items');

    this.app.useStore<SidebarItem>('sidebar/items').insertOne({
      key: 'home',
      value: {
        title: 'Home',
        icon: HomeIcon,
        path: '/',
        priority: 1,
        Component: () => 'Home',
      },
    });
  }

  async load() {
    const sidebarItems = this.app.useStore<SidebarItem>('sidebar/items').all();

    this.app.addRoute({
      path: '/bots/:id/*',
      element: (
        <Routes>
          <Route path="*" element={<Layout />}>
            {sidebarItems.map((item) => {
              let { path } = item.value;
              const Component = item.value.Component;

              path = path.replace(/^\//, '');

              return <Route path={path} element={<Component />} key={path} />;
            })}
          </Route>
        </Routes>
      ),
    });
  }
}
