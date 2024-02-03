import { GetBotByID } from '@botmate/platforms';
import { UpdateBotStore } from '@web/components/UpdateBotStore';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    botId: string;
  };
  children: React.ReactNode;
};
async function BotLayout({ children, params }: Props) {
  const bot = await GetBotByID(params.botId);
  if (!bot) {
    redirect('/bots');
  }

  return (
    <>
      {children}
      <UpdateBotStore bot={bot} />
    </>
  );
}

export default BotLayout;
