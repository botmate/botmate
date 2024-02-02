import * as uuid from 'uuid';
import { z } from 'zod';
import { protectedProcedure } from '@web/trpc/server/trpc';
import { PLATFORMS_KEYS } from '@botmate/platforms';
import { getTemporalClient } from '../temporal';
import { Errors } from '@botmate/shared';

export const createBot = protectedProcedure
  .input(
    z.object({
      platform: z.enum(PLATFORMS_KEYS),
      credentials: z.any(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session?.user.id as string;
    const { platform, credentials } = input;
    const temporal = await getTemporalClient();

    const wf = await temporal.workflow.execute('createBot', {
      workflowId: uuid.v4(),
      taskQueue: 'botmate',
      args: [userId, platform, credentials],
      retry: {
        maximumAttempts: 2,
        nonRetryableErrorTypes: [Errors.NotFound],
      },
    });

    return wf;
  });
