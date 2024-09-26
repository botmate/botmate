import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Application } from '../application';
import { trpc } from '../trpc';

type Props = {
  app: Application;
};
function BotProvider({ app }: Props) {
  const params = useParams() as { botId: string };

  const {
    isLoading,
    data: botInfo,
    error,
  } = trpc.getBot.useQuery(params.botId);

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

  if (error && 'status' in error) {
    if (error.status === 404) {
      return <div>Bot not found</div>;
    }
  }

  return <Outlet />;
}

export default BotProvider;
