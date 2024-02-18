import { Command } from '@prisma/client';
import { create } from 'zustand';

type CommandStore = {
  commands: Command[];
  insertCommand: (command: Command) => void;
  setCommands: (commands: Command[]) => void;
};

export const useCommandStore = create<CommandStore>((set) => ({
  commands: [],
  insertCommand: (command) => {
    set((state) => {
      return {
        commands: [...state.commands, command],
      };
    });
  },
  setCommands: (commands) => {
    set(() => {
      return {
        commands,
      };
    });
  },
}));
