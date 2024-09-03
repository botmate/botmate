import React from 'react';

import Sidebar from '../components/sidebar';

type Props = {
  children: React.ReactNode;
};
function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
}

export default MainLayout;
