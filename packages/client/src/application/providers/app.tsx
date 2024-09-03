import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Application } from '../application';
import { appContext } from '../context';
import MainLayout from '../layouts/main';
import { useGetBotInfoQuery } from '../services';

type Props = {
  app: Application;
};
export function AppProvider({ app }: Props) {
  const params = useParams();
  const { isLoading, isError } = useGetBotInfoQuery(params.id as string, {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="/logo.svg"
          alt="Loading..."
          className="w-16 h-16 animate-pulse rounded-2xl"
          draggable={false}
        />
      </div>
    );
  }

  if (!isError)
    return (
      <appContext.Provider value={app}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </appContext.Provider>
    );
}
