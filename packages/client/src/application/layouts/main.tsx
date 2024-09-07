import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/sidebar';

function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
