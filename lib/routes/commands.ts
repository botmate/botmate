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
    });
  });

export const createCommand = publicProcedure
  .input(
    z.object({
      botId: z.string(),
      alias: z.string().optional(),
      description: z.string(),
      response: z.string(),
    }),
  )
  .mutation(({ input }) => {
    // return prisma.command.create({
    //   data: {
    //     alias: input.alias,
    //     botId: input.botId,
    //   },
    // });
  });
