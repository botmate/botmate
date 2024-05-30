import { Outlet } from '@botmate/client';

import Sidebar from './sidebar';

function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
