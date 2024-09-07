import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Application } from '../application';
import { useGetBotInfoQuery } from '../services';

type Props = {
  app: Application;
};
function BotProvider({ app }: Props) {
  const params = useParams();

  const { isLoading, data: botInfo } = useGetBotInfoQuery(params.id as string, {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (botInfo) {
      app.bot = botInfo;
    }
  }, [botInfo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return <Outlet />;
}

export default BotProvider;
