import { publicProcedure } from '#lib/trpc/server';
import prisma from '#prisma';
import { z } from 'zod';

export const getCommands = publicProcedure
  .input(
    z.object({
      botId: z.string(),
    }),
  )
  .query(({ input }) => {
    return prisma.command.findMany({
      where: {
        botId: input.botId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

export const createCommand = publicProcedure
  .input(
    z.object({
      botId: z.string(),
      alias: z.string().optional(),
      actions: z.array(z.any()),
      condition: z.any(),
    }),
  )
  .mutation(({ input }) => {
    return prisma.command.create({
      data: {
        alias: input.alias,
        botId: input.botId,
        actions: input.actions,
        condition: input.condition,
      },
    });
  });
