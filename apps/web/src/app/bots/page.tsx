import { getServerSession } from 'next-auth';
import { AddBotButton } from '../../components/AddBotButton';
import { PageTitle } from '../../components/PageTitle';
import { authOptions } from '@web/lib/auth-options';
import prisma from '@web/lib/prisma';
import { redirect } from 'next/navigation';
import { BotsList } from '@web/components/BotsList';

async function BotsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const bots = await prisma.bot.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <PageTitle title="My Bots" extra={<AddBotButton />} />
      <BotsList bots={bots} />
    </>
  );
}

export default BotsPage;
