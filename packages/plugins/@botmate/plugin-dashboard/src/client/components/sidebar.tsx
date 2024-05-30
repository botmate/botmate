import { useMemo } from 'react';

import { Link, useLocation, useParams, useStore } from '@botmate/client';
import { SidebarItem } from '@botmate/types';

function Sidebar() {
  const params = useParams();
  const location = useLocation();
  const items = useStore<SidebarItem>('sidebar/items');

  const sorted = useMemo(() => {
    return items.sort((a, b) => a.value.priority - b.value.priority);
  }, [items]);

  return (
    <div className="w-64 bg-primary-foreground p-2 h-screen overflow-auto">
      {sorted.map(({ value }) => {
        let path = value.path;
        path = `/bots/${params.id}${path}`;

        const isActive = location.pathname === path;

        return (
          <Link
            to={path}
            key={value.title}
            className={`flex items-center ${
              isActive ? 'bg-primary text-primary-foreground' : ''
            } px-4 py-3 rounded-lg cursor-default
          }`}
          >
            <value.icon size={24} className="mr-2" />
            <div>{value.title}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;
