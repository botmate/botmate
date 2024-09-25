import React, { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@botmate/ui';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

import { socketContext } from '../socket';

type SocketProviderProps = {
  children: React.ReactNode;
};

type Maintenance = {
  title: string;
  message: string;
};

const socket = io('http://localhost:8233');
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);

  useEffect(() => {
    socket.on('maintenance_start', (data) => {
      setMaintenance(data);
    });

    socket.on('maintenance_end', () => {
      setMaintenance(null);
    });

    socket.on('server_message', (data) => {
      if (data.type === 'error') {
        toast.error(data.message);
      } else {
        toast.info(data.message);
      }
    });

    return () => {
      socket.off('maintenance_start');
      socket.off('maintenance_end');
      socket.off('server_message');
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>
      <AlertDialog open={!!maintenance}>
        <AlertDialogContent className="backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {maintenance?.title ?? 'Maintenance Mode'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {maintenance?.message ??
                'The server is performing some tasks. Please wait a moment.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {children}
    </socketContext.Provider>
  );
};
