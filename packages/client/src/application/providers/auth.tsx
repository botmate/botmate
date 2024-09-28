import { Loader2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { trpc } from '../trpc';

function AuthProvider() {
  const user = trpc.me.useQuery(undefined, {
    retry: 2,
  });

  if (user.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (user.isError) {
    window.location.href = '/login';
  }

  return <Outlet />;
}

export default AuthProvider;
