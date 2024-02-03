import { z } from 'zod';
import { protectedProcedure } from '@web/trpc/server/trpc';
import { CreateBot, PLATFORMS_KEYS } from '@botmate/platforms';

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
    try {
      const bot = await CreateBot(userId, platform, credentials);
      return bot;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  });
