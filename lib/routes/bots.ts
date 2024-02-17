import { platforms } from '#lib/platforms';
import { publicProcedure } from '#lib/trpc/server';
import prisma from '#prisma';
import { z } from 'zod';

export const addBot = publicProcedure
  .input(
    z.object({
      platform: z.string(),
      credentials: z.any({}),
    }),
  )
  .mutation(async ({ input }) => {
    switch (input.platform) {
      case 'telegram': {
        const botInfo = await platforms.telegram.getBotInfo(
          input.credentials.token,
        );

        return prisma.bot.create({
          data: {
            id: botInfo.id.toString(),
            platform: 'telegram',
            name: botInfo.first_name,
            info: botInfo as {},
            credentials: input.credentials,
          },
        });
      }
    }

    throw new Error('Invalid platform');
  });
