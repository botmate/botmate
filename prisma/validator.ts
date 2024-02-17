import { Prisma } from '@prisma/client';

const botListSelector = Prisma.validator<Prisma.BotDefaultArgs>()({
  select: {
    id: true,
    name: true,
    avatar: true,
  },
});

export type BotList = Prisma.BotGetPayload<typeof botListSelector>[];
