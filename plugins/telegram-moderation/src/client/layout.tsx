import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { SidebarItem, SidebarLayout } from '@botmate/ui';

import { TelegramModeration } from './client';

const options: SidebarItem[] = [
  {
    title: 'Moderation',
    description: 'Basic moderation settings',
    path: '',
  },
  {
    title: 'New Users',
    description: 'Policies, welcome message',
    path: '/new-users',
  },
  {
    title: 'Anti-spam',
    description: 'Prevent spam messages',
    path: '/anti-spam',
  },
  {
    title: 'Filters',
    description: 'Apply filters to messages',
    path: '/filters',
  },
];

type Props = {
  children: React.ReactNode;
};
function Layout({ children }: Props) {
  const params = useParams();
  const location = useLocation();
  const items = useMemo(() => {
    return options.map((item) => {
      const path = `/bots/${params.botId}/moderation${item.path}`;
      return {
        ...item,
        path,
        regex: new RegExp(`^${path}$`),
      };
    });
  }, [location]);

  return (
    <SidebarLayout title={TelegramModeration.displayName} items={items}>
      {children}
    </SidebarLayout>
  );
}

export default Layout;
