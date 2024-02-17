'use client';

import { BotList } from '#prisma/validator';
import { useGlobalStore } from '#store/global';
import { MenuItem } from '#types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#ui/select';
import { Bot } from '@prisma/client';
import React from 'react';
import {
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineTerminal,
  HiOutlineUser,
  HiOutlineUsers,
  HiUsers,
} from 'react-icons/hi';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items: MenuItem[] = [
  {
    path: '/bots/[id]',
    icon: HiOutlineHome,
    label: 'Home',
  },
  {
    path: '/bots/[id]/users',
    icon: HiOutlineUser,
    label: 'Users',
  },
  {
    path: '/bots/[id]/commands',
    icon: HiOutlineTerminal,
    label: 'Commands',
  },
  {
    path: '/bots/[id]/settings',
    icon: HiOutlineCog,
    label: 'Settings',
  },
];

type BotMenuProps = {
  botList: Bot[];
};
function BotMenu({ botList }: BotMenuProps) {
  const r = useRouter();
  const pathname = usePathname();
  const { currentBot, setCurrentBot } = useGlobalStore();

  return (
    <div className="flex flex-col h-full w-60 border-r">
      <div className="p-4 border-b">
        <Select
          onValueChange={(v) => {
            const bot = botList.find((b) => b.id === v);
            if (bot) {
              setCurrentBot(bot);
              r.push(`/bots/${bot.id}`);
            }
          }}
        >
          <SelectTrigger className="shadow-sm">
            <SelectValue placeholder={currentBot?.name} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {botList.map((bot) => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col p-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active =
            pathname === item.path.replace('[id]', currentBot?.id || '');

          return (
            <Link
              key={index}
              href={item.path.replace('[id]', currentBot?.id || '')}
              className={`flex gap-2 py-2 px-4 rounded-md cursor-default ${
                active ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon size={24} />
              <h1>{item.label}</h1>
            </Link>
          );
        })}
      </div>
      <div></div>
    </div>
  );
}

export { BotMenu };
