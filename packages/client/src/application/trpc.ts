import { createTRPCReact } from '@trpc/react-query';

import { AppRouter } from '@botmate/server';

export const trpc = createTRPCReact<AppRouter>();
