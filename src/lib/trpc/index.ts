import { publicProcedure, router } from './server';

export const appRouter = router({
  ping: publicProcedure.query(() => 'pong!'),
});

export type AppRouter = typeof appRouter;
