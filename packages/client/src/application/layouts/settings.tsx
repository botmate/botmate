import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { SidebarItem, SidebarLayout } from '@botmate/ui';

import useCurrentBot from '../hooks/use-bot';
import { useGetPluginsQuery } from '../services/plugins';

const items: SidebarItem[] = [
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
    plugins?.map<SidebarItem>((plugin) => ({
      title: plugin.displayName,
      path: `/bots/${params.botId}/settings/plugins/${encodeURIComponent(
        plugin.name,
      )}`,
    })) || [];

  return (
    <SidebarLayout
      title="Settings"
      items={[...settingsItems, 'Plugins', ...pluginsItems]}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default SettingsLayout;
