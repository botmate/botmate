import React from 'react';
import { AppBar } from '@web/components/AppBar';
import { AppSidebar } from '@web/components/AppSidebar';

function BotsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <AppBar />

      <div className="flex-1 h-full flex">
        <div className="border-r-1">
          <AppSidebar />
        </div>

        <div className="flex-1 h-full">{children}</div>
      </div>
    </div>
  );
}

export default BotsLayout;
