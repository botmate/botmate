import { useParams } from 'react-router-dom';

import { useGetBotInfoQuery } from '../services';

function useCurrentBot() {
  const params = useParams();
  const { data } = useGetBotInfoQuery(params.id as string);
  return data!;
}

export default useCurrentBot;
