import { useContext } from 'react';

import { appContext } from '../context';

export function useApp() {
  return useContext(appContext);
}
