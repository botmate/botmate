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
    <div
      className={`flex-1 flex flex-col gap-6 container mx-auto overflow-auto 2xl:p-12 p-8`}
    >
      <div className="flex justify-between items-center">
        <div>
          {/* <span className="text-muted-foreground text-sm">
            {page === 'settings' ? 'Settings' : 'Dashboard'} &gt;
          </span> */}
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div>{actions}</div>
      </div>

      <div className="flex-1 flex items-start gap-4">
        <div className="flex-1">{first}</div>
        <div className="2xl:w-[30rem] w-[20rem]">{second}</div>
      </div>
    </div>
  );
}
