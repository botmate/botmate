import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  type?: 'default' | 'settings';
  actions?: React.ReactNode;
};
export function PageLayout({
  children,
  title,
  subtitle,
  type: page = 'default',
  actions,
}: Props) {
  const elements = React.Children.toArray(children);
  const [first, second] = elements;

  return (
    <div className={`flex-1 flex flex-col`}>
      <div className="h-20 flex items-center justify-between px-4 border-b">
        <h1 className="text-xl font-medium">{title}</h1>
        <div>{actions}</div>
      </div>

      <div className="flex-1 flex items-start gap-4 p-4">
        <div className="flex-1">{first}</div>
        <div className="2xl:w-[30rem] w-[20rem]">{second}</div>
      </div>
    </div>
  );
}
