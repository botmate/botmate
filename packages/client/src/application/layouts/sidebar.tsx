import React from 'react';

import SidebarItem from '../components/sidebar-item';

type Props = {
  items: React.ReactNode[];
  children?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
};
export function SidebarLayout({ items, children, title, actions }: Props) {
  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      <div className="min-h-20 h-20 w-full border-b flex items-center px-4 justify-between">
        <h1 className="text-xl font-medium">{title}</h1>
        {actions}
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="w-72 p-4 space-y-6 bg-card border-r overflow-auto">
          <div className="flex flex-col gap-1">{items}</div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export { SidebarItem };
