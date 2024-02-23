import { publicProcedure } from '#lib/trpc/server';
import prisma from '#prisma';
import { z } from 'zod';

export const getCommands = publicProcedure
  .input(
    z.object({
      botId: z.string(),
      sort: z.enum(['asc', 'desc']).optional(),
    }),
  )
  .query(({ input }) => {
    return prisma.command.findMany({
      where: {
        botId: input.botId,
      },
      orderBy: {
        createdAt: input.sort ?? 'desc',
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
