import { publicProcedure } from '#lib/trpc/server';
import prisma from '#prisma';
import { z } from 'zod';

export const getWorkflows = publicProcedure
  .input(
    z.object({
      botId: z.string(),
    }),
  )
  .query(({ input }) => {
    return prisma.workflow.findMany({
      where: {
        botId: input.botId,
      },
    });
  });

export const createWorkflow = publicProcedure
  .input(
    z.object({
      botId: z.string(),
      alias: z.string().optional(),
      description: z.string(),
      response: z.string(),
    }),
  )
  .mutation(({ input }) => {
    // return prisma.workflow.create({
    //   data: {
    //     alias: input.alias,
    //     botId: input.botId,
    //   },
    // });
  });
