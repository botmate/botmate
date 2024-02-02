import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@web/trpc/server';
import { createContext } from '@web/trpc/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
