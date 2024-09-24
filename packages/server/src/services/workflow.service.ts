import { WorkflowEvent } from '@botmate/platform';
import { z } from 'zod';

import { Application } from '../application';
import { publicProcedure } from './_trpc';

export class WorkflowService {
  constructor(private app: Application) {}

  getRoutes() {
    return {
      getWorkflowEvents: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
          const events = await this.app.workflowManager.getEvents(input);
          return events as Record<string, WorkflowEvent>;
        }),
    };
  }
}
