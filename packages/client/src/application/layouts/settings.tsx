import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

import SidebarItem from '../components/sidebar-item';
import useCurrentBot from '../hooks/use-bot';
import { useGetPluginsQuery } from '../services/plugins';
import { SidebarLayout } from './sidebar';

const items = [
  {
    title: 'General',
    description: 'Configure general settings',
    path: '',
    regex: /^\/$/,
  },
  {
    title: 'Advanced',
    description: 'Configure advanced settings',
    path: '/advanced',
    regex: /^\/advanced$/,
  },
];

const NoPlugins = (
  <div>
    <div className="flex flex-col gap-2 mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200 text-orange-500 dark:bg-orange-900/10 dark:border-orange-600">
      <div className="text-center text-sm">No plugins are installed</div>
    </div>
  </div>
);

function SettingsLayout() {
  const params = useParams();
  const bot = useCurrentBot();
  const { pathname } = useLocation();

  const { data: plugins } = useGetPluginsQuery(bot.platformType);
  const basePath = `/bots/${params.botId}/settings`;

  const settingsItems = items.map((item) => (
    <Link key={item.title} to={`${basePath}${item.path}`}>
      <SidebarItem
        title={item.title}
        description={item.description}
        active={pathname === `${basePath}${item.path}`}
      />
    </Link>
  ));

  const pluginsItems =
    plugins?.map((plugin) => (
      <Link
        key={plugin.displayName}
        to={`/bots/${params.botId}/settings/plugins/${encodeURIComponent(
          plugin.name,
        )}`}
      >
        <SidebarItem
          title={plugin.displayName}
          active={
            pathname ===
            `/bots/${params.botId}/settings/plugins/${encodeURIComponent(
              plugin.name,
            )}`
          }
        />
      </Link>
    )) || [];

  return (
    <SidebarLayout
      title="Settings"
      items={[
        settingsItems,
        <h1
          className={`text-gray-600 dark:text-neutral-500 text-sm uppercase mt-6`}
          key="plugins-title"
        >
          Plugins
        </h1>,
        pluginsItems.length === 0 ? NoPlugins : pluginsItems,
      ]}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default SettingsLayout;
