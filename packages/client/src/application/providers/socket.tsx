import React from 'react';

import { io } from 'socket.io-client';

import { socketContext } from '../socket';

type SocketProviderProps = {
  children: React.ReactNode;
};
export const SocketProvider = ({ children }: SocketProviderProps) => {
  return (
    <socketContext.Provider value={io('http://localhost:8233')}>
      {children}
    </socketContext.Provider>
  );
};
