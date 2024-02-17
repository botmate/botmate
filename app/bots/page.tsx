import prisma from '#prisma';

import BotList from '#components/bot-list';

async function BotsPage() {
  const bots = await prisma.bot.findMany();

  return <BotList bots={bots} />;
}

export default BotsPage;
