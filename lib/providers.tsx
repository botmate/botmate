'use client';

import { useGlobalStore } from '#store/global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import { trpc } from './trpc/client';

type Props = {
  children: React.ReactNode;
  version: string;
};
function Providers({ children, version }: Props) {
  const setVersion = useGlobalStore((s) => s.setVersion);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
  );

  useEffect(() => {
    setVersion(version);
  }, [version, setVersion]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

      <ProgressBar
        color="#373636"
        options={{
          showSpinner: false,
        }}
      />
      <Toaster />
    </trpc.Provider>
  );
}

export default Providers;
