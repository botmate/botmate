import React from 'react';

import { MainMenu } from '#components/menu';

type Props = {
  children: React.ReactNode;
};
function MainLayout({ children }: Props) {
  return (
    <div className="flex items-center h-screen">
      <div className="w-[30rem] mx-auto h-[80%] space-y-4">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-blue-500">bot</span>
          mate
        </h1>

        <MainMenu />

        <div>{children}</div>
      </div>
    </div>
  );
}

export { MainLayout };
