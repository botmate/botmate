import { createContext } from 'react';

import { Application } from './application';

export const appContext = createContext<Application>({} as Application);
