import React from 'react';

import SidebarItem from '../components/sidebar-item';

type Props = {
  items: React.ReactNode[];
  children?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
};
export function SidebarLayout({
  items,
  children,
  title,
  actions,
  footer,
}: Props) {
  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      <div className="min-h-20 h-20 w-full border-b flex items-center px-4 justify-between">
        <h1 className="text-xl font-medium">{title}</h1>
        {actions}
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="flex flex-col w-72 space-y-6 bg-card border-r h-full">
          <div className="flex flex-col gap-1 overflow-auto p-4 h-full">
            {items}
          </div>
          {footer ? (
            <>
              <div className="flex-1" />
              <div className="h-14 border-t flex items-center justify-center">
                {footer}
              </div>
            </>
          ) : null}
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export { SidebarItem };
