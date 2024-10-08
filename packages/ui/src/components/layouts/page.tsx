import React from 'react';

import { cn } from '../../utils';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;

  rightPane?: React.ReactNode;
};
export function PageLayout({
  children,
  title,
  actions,
  className,
  subtitle,
  rightPane,
}: Props) {
  const elements = React.Children.toArray(children);
  const [first, second] = elements;

  if (second) {
    rightPane = second;
  }

  return (
    <div className={cn(`flex-1 flex flex-col`, className)}>
      <div className="min-h-20 flex items-center justify-between px-4 border-b">
        <div>
          <h1 className="text-xl font-medium">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div>{actions}</div>
      </div>

      <div className="flex-1 flex items-start gap-4 p-4 overflow-auto">
        <div className="flex-1">{first}</div>
        {rightPane && (
          <div className="hidden xl:block 2xl:w-[30rem] w-[20rem]">
            {second}
          </div>
        )}
      </div>
    </div>
  );
}
