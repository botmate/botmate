import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useTheme } from 'next-themes';

import { Application } from '../application';
import { appContext } from '../context';

type Props = {
  app: Application;
};
export function AppProvider({ app }: Props) {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <appContext.Provider value={app}>
      <Outlet />
    </appContext.Provider>
  );
}
