import { Bot } from '@prisma/client';
import { create } from 'zustand';

type AppStore = {
  activeBot: Bot | null;
  setActiveBot: (bot: Bot) => void;
};

export const useBotStore = create<AppStore>((set) => ({
  activeBot: null,
  setActiveBot: (bot) => set({ activeBot: bot }),
}));
