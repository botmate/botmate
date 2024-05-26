import { createContext } from 'react';

import { Application } from './application';

export const ApplicationContext = createContext<Application>({} as Application);
