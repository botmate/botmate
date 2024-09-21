import { initTRPC } from '@trpc/server';

import { Application } from '../application';
import { BotsService } from './bots.service';
import { PluginsService } from './plugins.service';

const t = initTRPC.create();

export const publicProcedure = t.procedure;

export function initTrpc(app: Application) {
  const appRouter = t.router({
    ...new BotsService(app).getRoutes(),
    ...new PluginsService(app).getRoutes(),
  });

  return appRouter;
}

export type AppRouter = ReturnType<typeof initTrpc>;
