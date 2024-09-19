import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export type SidebarListItem = {
  title: string;
  description?: string;
  path: string;
  regex?: RegExp;
};
type Props = {
  items: (SidebarListItem | string)[];
  children?: React.ReactNode;
  title?: string;
};
export function SidebarListLayout({ items, children, title }: Props) {
  const location = useLocation();

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      <div className="min-h-20 h-20 w-full border-b flex items-center px-4">
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="w-72 p-4 space-y-6 bg-card border-r overflow-auto">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              if (typeof item === 'string') {
                return (
                  <h1
                    className="text-gray-600 dark:text-neutral-500 text-sm uppercase mt-3 mb-1"
                    key={item}
                  >
                    {item}
                  </h1>
                );
              }

              let isActive = false;

              if (item.regex) {
                const fullPath = `${location.pathname}${window.location.search}`;
                isActive = item.regex.test(fullPath);
              } else {
                isActive = location.pathname === item.path;
              }

              return (
                <Link key={item.title} to={item.path}>
                  <div
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-150 ${
                      isActive
                        ? 'bg-gray-100 dark:bg-accent'
                        : 'hover:bg-gray-100/50 dark:hover:bg-accent/50'
                    }`}
                  >
                    <h2 className="font-medium">{item.title}</h2>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
