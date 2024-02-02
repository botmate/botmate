import { publicProcedure } from '@web/trpc/server/trpc';

export const ping = publicProcedure.query(() => {
  return 'pong';
});
