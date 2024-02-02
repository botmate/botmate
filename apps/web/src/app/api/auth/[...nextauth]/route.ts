import NextAuth from 'next-auth';
import { authOptions } from '@web/lib/auth-options';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
