import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};
export function PageLayout({ children, title, actions }: Props) {
  const elements = React.Children.toArray(children);
  const [first, second] = elements;

  return (
    <div className={`flex-1 flex flex-col`}>
      <div className="min-h-20 flex items-center justify-between px-4 border-b sticky top-0 bg-card z-20">
        <h1 className="text-xl font-medium">{title}</h1>
        <div>{actions}</div>
      </div>

      <div className="flex-1 flex items-start gap-4 p-4 z-10 h-screen overflow-auto">
        <div className="flex-1 h-full">{first}</div>
        <div className="2xl:w-[30rem] w-[20rem]">{second}</div>
      </div>
    </div>
  );
}
