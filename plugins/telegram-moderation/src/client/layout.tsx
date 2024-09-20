import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { SidebarItem, SidebarLayout } from '@botmate/client';

import { TelegramModeration } from './client';

const menuItems = [
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
    return menuItems.map((item) => (
      <Link
        key={item.title}
        to={`/bots/${params.botId}/moderation${item.path}`}
      >
        <SidebarItem
          title={item.title}
          description={item.description}
          active={
            location.pathname === `/bots/${params.botId}/moderation${item.path}`
          }
        />
      </Link>
    ));
  }, [location]);

  return (
    <SidebarLayout title={TelegramModeration.displayName} items={items}>
      {children}
    </SidebarLayout>
  );
}

export default Layout;
