import { initTRPC } from '@trpc/server';

import { Application } from '../application';
import { IUser } from '../models/users.model';
import { PlatformAnalyticsService } from './analytics.service';
import { WorkflowService } from './workflow.service';

type Context = {
  token?: string;
  user: IUser | null;
};

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new Error('Unauthorized');
  }
  return opts.next(opts);
});

export function initTrpc(app: Application) {
  const appRouter = t.router({
    ...app.botsService.getRoutes(),
    ...app.pluginsService.getRoutes(),
    ...app.rpcService.getRoutes(),
    ...app.authService.getRoutes(),
    ...app.usersService.getRoutes(),
    ...new PlatformAnalyticsService(app).getRoutes(),
    ...new WorkflowService(app).getRoutes(),
  });

  return appRouter;
}

export type AppRouter = ReturnType<typeof initTrpc>;
