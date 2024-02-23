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
      name: z.string(),
      description: z.string().optional(),
    }),
  )
  .mutation(({ input }) => {
    return prisma.command.create({
      data: {
        name: input.name,
        description: input.description,
        botId: input.botId,
      },
    });
  });
