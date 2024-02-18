import prisma from '#prisma';
import React from 'react';

import { redirect } from 'next/navigation';

import CommandEditor from '#components/command/editor';

type Props = {
  params: {
    cmdId: string;
  };
};
async function Page({ params }: Props) {
  const { cmdId } = params;

  const command = await prisma.command.findFirst({
    where: {
      id: cmdId,
    },
  });

  if (!command) {
    redirect('/');
  }

  return <CommandEditor command={command} />;
}

export default Page;
