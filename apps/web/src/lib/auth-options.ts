import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import prisma from '@web/lib/prisma';

export const authOptions: AuthOptions = {
  // @ts-expect-error adapter
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session(params) {
      if (!params.session?.user?.email) {
        return params.session;
      }
      const user = await prisma.user.findFirst({
        where: {
          email: params.session.user.email,
        },
      });
      if (!user) {
        return params.session;
      }
      params.session.user = user;
      return params.session;
    },
  },
};
