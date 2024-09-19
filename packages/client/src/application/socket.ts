import { createContext } from 'react';

import { io } from 'socket.io-client';

export const socketContext = createContext(io('http://localhost:8233'));
