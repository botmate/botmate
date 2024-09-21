import { useParams } from 'react-router-dom';

import { trpc } from '../trpc';

function useCurrentBot() {
  const params = useParams() as { botId: string };
  const { data } = trpc.getBot.useQuery(params.botId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
}

export default useCurrentBot;
