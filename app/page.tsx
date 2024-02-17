import prisma from '#prisma';

import BotList from '#components/bot-list';
import { MainLayout } from '#components/layouts';

async function HomePage() {
  const bots = await prisma.bot.findMany();

  return (
    <MainLayout>
      <BotList bots={bots} />;
    </MainLayout>
  );
}

export default HomePage;
