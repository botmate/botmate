import React from 'react';

type Props = {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};
function PageLayout({ title, children, actions }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-r sticky top-0 z-40">
        <div className="flex items-center px-4 h-16">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex-1" />
          {actions}
        </div>
      </div>

      <div className="flex-1 overflow-auto z-10">{children}</div>
    </div>
  );
}

export default PageLayout;
