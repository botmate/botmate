import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { ListItem } from '@botmate/ui';

const options = [
  {
    label: 'Basic',
    description: 'Basic settings for moderation',
    path: '',
  },
  {
    label: 'Welcome',
    description: 'Configure welcome messages',
    path: '/welcome',
  },
  {
    label: 'Anti-spam',
    description: 'Prevent spam messages',
    path: '/anti-spam',
  },
  {
    label: 'Filters',
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
  const relativePath = location.pathname.replace(/\/bots\/\d+\/moderation/, '');

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <div className="w-72 py-6 p-4 space-y-6 bg-card border-r overflow-auto">
        <div className="flex flex-col gap-1">
          {options.map((item) => {
            const path = `/bots/${params.botId}/moderation${item.path}`;
            const isActive = relativePath === item.path;
            return (
              <Link to={path} key={item.label}>
                <ListItem
                  label={item.label}
                  description={item.description}
                  isActive={isActive}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export default Layout;
