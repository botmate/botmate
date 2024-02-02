import { router } from './trpc';
import * as routers from '@web/lib/routes';

export const appRouter = router(routers);

export type AppRouter = typeof appRouter;
