import { Bot } from '@prisma/client';
import { create } from 'zustand';

type GlobalStore = {
  currentBot: Bot | null;
  setCurrentBot: (bot: Bot) => void;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  currentBot: null,
  setCurrentBot: (bot) => set({ currentBot: bot }),
}));
