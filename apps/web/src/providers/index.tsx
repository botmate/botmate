'use client';

import TrpcProvider from '../trpc/provider';
import { NextUIProvider } from '@nextui-org/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

type Props = {
  children: React.ReactNode;
  session: Session;
};
function Providers({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </TrpcProvider>
      <Toaster />
    </SessionProvider>
  );
}

export default Providers;
