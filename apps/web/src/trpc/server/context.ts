import { authOptions } from '@web/lib/auth-options';
import prisma from '@web/lib/prisma';
import trpc from '@trpc/server';
import { getServerSession } from 'next-auth';

export async function createContext() {
  const session = await getServerSession(authOptions);

  return {
    prisma,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
