import { useContext } from 'react';

import { socketContext } from '../socket';

export const useSocketIO = () => {
  return useContext(socketContext);
};
