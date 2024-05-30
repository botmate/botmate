import { Plugin, loadable } from '@botmate/client';
import { SettingsIcon } from '@botmate/icons';
import { SidebarItem } from '@botmate/types';

const Settings = loadable(() => import('./components/settings'));

export class SettingsPlugin extends Plugin {
  priority = 1;

  async beforeLoad() {
    this.app.registerNamespace('settings/items');

    this.app.useStore<SidebarItem>('sidebar/items').insertOne({
      key: 'settings',
      value: {
        title: 'Settings',
        icon: SettingsIcon,
        path: '/settings',
        priority: 100,
        Component: Settings,
      },
    });
  }
}
