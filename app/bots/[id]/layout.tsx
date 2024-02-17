import prisma from '#prisma';
import React from 'react';

import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

import { BotLayout } from '#components/layouts';

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};
async function BotsIdLayout({ children, params }: Props) {
  const bot = await prisma.bot.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!bot) {
    redirect('/');
  }

  const bots = await prisma.bot.findMany();

  return (
    <BotLayout bot={bot} bots={bots}>
      {children}
    </BotLayout>
  );
}

export default BotsIdLayout;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bot = await prisma.bot.findFirst({
    where: {
      id: params.id,
    },
  });

  return {
    title: bot?.name,
  };
}
