import prisma from '#prisma';

import { redirect } from 'next/navigation';

import CommandHero from '#components/command/hero';

type Props = {
  params: {
    id: string;
  };
};
async function Page({ params }: Props) {
  const latestCommand = await prisma.command.findFirst({
    where: {
      botId: params.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (latestCommand) {
    redirect(`/bots/${params.id}/commands/${latestCommand.id}`);
  }

  return <CommandHero />;
}

export default Page;
