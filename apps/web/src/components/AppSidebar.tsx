/* eslint-disable no-useless-escape */
'use client';

import {
  HomeIcon,
  SettingsIcon,
  CodeIcon,
  BarChart2Icon,
  StarIcon,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

type SidebarItemProps = {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
};

function SidebarItem({ title, icon: Icon, isActive }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center space-x-2 border-2 p-4 text-gray-600 rounded-xl transition-all duration-300 ${
        isActive ? 'bg-gray-100 font-semibold' : 'border-transparent'
      }`}
    >
      <div className="w-6 h-6">
        <Icon />
      </div>
      <div className="text-sm">{title}</div>
    </div>
  );
}

const AppSidebarItems = [
  {
    title: 'Home',
    icon: HomeIcon,
    regex: /^\/bots$/,
    link: '/',
  },
  {
    title: 'Feedback',
    icon: StarIcon,
    regex: /^\/feedback$/,
    link: '/feedback',
  },
];

export function RootSidebar() {
  const pathname = usePathname();

  return (
    <div className="p-4">
      {AppSidebarItems.map(({ title, icon, regex, link }) => {
        const isActive = regex.test(pathname);
        return (
          <Link key={title} href={link}>
            <SidebarItem title={title} icon={icon} isActive={isActive} />
          </Link>
        );
      })}
    </div>
  );
}

const BotSidebarItem = [
  {
    title: 'Home',
    icon: HomeIcon,
    regex: /^\/bots\/\-?[a-zA-Z0-9]+$/,
    link: '/bots/[botId]',
  },
  {
    title: 'Editor',
    icon: CodeIcon,
    regex: /^\/bots\/\-?[a-zA-Z0-9]+\/editor$/,
    link: '/bots/[botId]/editor',
  },
  {
    title: 'Analytics',
    icon: BarChart2Icon,
    regex: /^\/bots\/\-?[a-zA-Z0-9]+\/analytics$/,
    link: '/bots/[botId]/analytics',
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    regex: /^\/bots\/\-?[a-zA-Z0-9]+\/settings$/,
    link: '/bots/[botId]/settings',
  },
];

function BotSidebar() {
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col p-4">
      {BotSidebarItem.map(({ title, icon, regex, link }) => {
        const _link = link.replace(/\[\w+\]/g, (match) => {
          const key = match.replace(/[\[\]]/g, '');
          const value = params[key];
          return value as string;
        });

        return (
          <Link key={title} href={_link}>
            <SidebarItem
              title={title}
              icon={icon}
              isActive={regex.test(pathname)}
            />
          </Link>
        );
      })}

      <div className="flex-1" />
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  let element = <RootSidebar />;

  if (pathname !== '/bots') {
    element = <BotSidebar />;
  }

  return <div className="hidden md:block w-72 h-full">{element}</div>;
}
