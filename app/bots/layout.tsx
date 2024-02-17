import prisma from '#prisma';
import React from 'react';

import { redirect } from 'next/navigation';

import { BotLayout } from '#components/layouts';

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};
async function BotsLayout({ children, params }: Props) {
  const bot = await prisma.bot.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!bot) {
    redirect('/');
  }

  return <BotLayout bot={bot}>{children}</BotLayout>;
}

export default BotsLayout;
