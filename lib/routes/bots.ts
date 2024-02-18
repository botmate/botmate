import { telegram } from '#lib/telegram';
import { publicProcedure } from '#lib/trpc/server';
import prisma from '#prisma';
import { BotData } from '#types';
import { z } from 'zod';

export const getBots = publicProcedure.query(async () => {
  const bots = await prisma.bot.findMany();
  return bots as BotData[];
});

export const addBot = publicProcedure
  .input(
    z.object({
      token: z.string({}),
    }),
  )
  .mutation(async ({ input }) => {
    const botInfo = await telegram.getBotInfo(input.token);

    return prisma.bot.create({
      data: {
        id: botInfo.id.toString(),
        name: botInfo.first_name,
        info: botInfo as {},
        token: input.token,
      },
    });
  });
