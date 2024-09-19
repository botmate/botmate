import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import useCurrentBot from '../hooks/use-bot';
import { useGetPluginsQuery } from '../services/plugins';
import { SidebarListItem, SidebarListLayout } from './sidebar-list';

const items: SidebarListItem[] = [
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

function SettingsLayout() {
  const params = useParams();

  const bot = useCurrentBot();

  const { data: plugins } = useGetPluginsQuery(bot.platformType);

  const settingsItems = items.map((item) => ({
    ...item,
    path: `/bots/${params.botId}/settings${item.path}`,
    regex: new RegExp(`^/bots/${params.botId}/settings${item.path}$`),
  }));

  const pluginsItems =
    plugins?.map<SidebarListItem>((plugin) => ({
      title: plugin.displayName,
      path: `/bots/${params.botId}/settings/plugins/${encodeURIComponent(
        plugin.name,
      )}`,
    })) || [];

  return (
    <SidebarListLayout
      title="Settings"
      items={[...settingsItems, 'Plugins', ...pluginsItems]}
    >
      <Outlet />
    </SidebarListLayout>
  );
}

export default SettingsLayout;
