'use client';

import { useGlobalStore } from '#store/global';
import { Bot } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

import { BotMenu } from '#components/menu';

type Props = {
  bot: Bot;
  bots: Bot[];
  children: React.ReactNode;
};
function BotLayout({ children, bot, bots }: Props) {
  const currentBot = useGlobalStore((s) => s.currentBot);
  const setCurrentBot = useGlobalStore((s) => s.setCurrentBot);

  useEffect(() => {
    setCurrentBot(bot);
  }, [bot, setCurrentBot]);

  if (!currentBot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <BotMenu botList={bots} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export { BotLayout };
