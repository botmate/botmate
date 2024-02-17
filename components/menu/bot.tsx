'use client';

import botmate from '#public/botmate.svg';
import { useGlobalStore } from '#store/global';
import { MenuItem } from '#types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#ui/select';
import { Bot } from '@prisma/client';
import React from 'react';
import {
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineDatabase,
  HiOutlineHome,
  HiOutlineTerminal,
} from 'react-icons/hi';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items: MenuItem[] = [
  {
    path: '/bots/[id]',
    icon: HiOutlineHome,
    label: 'Home',
  },
  {
    path: '/bots/[id]/database',
    icon: HiOutlineDatabase,
    label: 'Database',
  },
  {
    path: '/bots/[id]/commands',
    icon: HiOutlineTerminal,
    label: 'Commands',
  },
  {
    label: 'Notifications',
    path: '/bots/[id]/notifications',
    icon: HiOutlineBell,
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
  const { currentBot, setCurrentBot, version } = useGlobalStore();

  return (
    <div className="flex flex-col h-full w-72 border-r">
      <div className="p-4 border-b space-y-4">
        <Image
          alt="logo"
          src={botmate}
          width={50}
          height={50}
          className="rounded-md"
        />

        <Select
          onValueChange={(v) => {
            const bot = botList.find((b) => b.id === v);
            if (bot) {
              setCurrentBot(bot);
              r.push(`/bots/${bot.id}`);
            }
          }}
          value={currentBot?.id}
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
      <div className="flex-grow"></div>
      <div>
        <p className="py-2 text-center text-xs text-gray-500">
          BotMate v{version}
        </p>
      </div>
    </div>
  );
}

export { BotMenu };
