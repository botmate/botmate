import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

const items = [
  {
    id: 1,
    name: 'General',
    description: 'Configure general settings',
    path: '/',
    regex: /^\/$/,
  },
  {
    id: 2,
    name: 'Appearance',
    description: 'Customize the appearance',
    path: '/appearance',
    regex: /^\/appearance$/,
  },
];

function SettingsLayout() {
  const params = useParams();
  const location = useLocation();

  return (
    <div className="flex flex-1">
      <div className="w-72 bg-card py-6 p-4 space-y-6">
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const relativePath = location.pathname.replace(
              /^\/bots\/\d+\/settings/,
              '',
            );
            const isActive = item.regex.test(relativePath || '/');

            const absolutePath = `/bots/${params.id}/settings${item.path}`;

            return (
              <Link
                key={item.id}
                to={absolutePath}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100/50'}`}
              >
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
              </Link>
            );
          })}
        </div>
        <div>
          <h1 className="text-gray-600 text-sm uppercase">Plugins</h1>
          <div className="flex flex-col gap-2 mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200 text-orange-500">
            <div className="text-center text-sm">No plugins are installed</div>
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
