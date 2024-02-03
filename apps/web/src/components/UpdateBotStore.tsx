'use client';

import { Bot } from '@prisma/client';
import { useAppStore } from '@web/store/app';
import { useBotStore } from '@web/store/bot';
import { useEffect } from 'react';

type UpdateBotStoreProps = {
  bot: Bot;
};
function UpdateBotStore({ bot }: UpdateBotStoreProps) {
  const { setAppTitle } = useAppStore();
  const { setActiveBot } = useBotStore();

  useEffect(() => {
    setActiveBot(bot);
    setAppTitle(bot.name);
  }, [bot, setActiveBot, setAppTitle]);

  return <></>;
}

export { UpdateBotStore };
