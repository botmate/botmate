import React from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';

import { useGetPluginsQuery } from '../services/plugins';

const items = [
  {
    id: 1,
    name: 'General',
    description: 'Configure general settings',
    path: '/',
    regex: /^\/$/
  },
  {
    id: 2,
    name: 'Advanced',
    description: 'Configure advanced settings',
    path: '/advanced',
    regex: /^\/advanced$/
  }
];

const NoPlugins = (
  <div>
    <div className="flex flex-col gap-2 mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200 text-orange-500">
      <div className="text-center text-sm">No plugins are installed</div>
    </div>
  </div>
);
function SettingsLayout() {
  const params = useParams();
  const location = useLocation();
  const { data: plugins, isLoading } = useGetPluginsQuery();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-1">
      <div className="w-72 py-6 p-4 space-y-6 bg-card border-r">
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const relativePath = location.pathname.replace(
              /^\/bots\/\d+\/settings/,
              ''
            );
            const isActive = item.regex.test(relativePath || '/');

            const absolutePath = `/bots/${params.id}/settings${item.path}`;

            return (
              <Link
                key={item.id}
                to={absolutePath}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${isActive ? 'bg-muted' : 'hover:bg-gray-100/50 dark:hover:bg-neutral-800'}`}
              >
                <h2 className="font-medium">{item.name}</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="space-y-2">
          <h1 className="text-gray-600 dark:text-neutral-500 text-sm uppercase">
            Plugins
          </h1>
          <div>
            {isLoading ? (
              <div>Loading...</div>
            ) : plugins?.length === 0 ? (
              NoPlugins
            ) : (
              plugins?.map((plugin) => {
                const relativePath = location.pathname.replace(
                  /^\/bots\/\d+\/settings/,
                  ''
                );
                const absolutePath = `/bots/${params.id}/settings/plugins?plugin=${plugin.name}`;

                const isActive = searchParams.get('plugin') === plugin.name;

                return (
                  <Link key={plugin.id} to={absolutePath}>
                    <div
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${isActive ? 'bg-gray-100 dark:bg-neutral-800' : 'hover:bg-gray-100/50 dark:hover:bg-neutral-800'}`}
                    >
                      <h2 className="font-medium">{plugin.displayName}</h2>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
