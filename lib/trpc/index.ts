import * as routes from '#lib/routes';

import { router } from './server';

export const appRouter = router(routes);

export type AppRouter = typeof appRouter;
