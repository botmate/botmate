import {
  ChartAreaIcon,
  LayoutDashboard,
  LucideIcon,
  Settings2Icon,
  ShoppingBagIcon,
  // WorkflowIcon,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@botmate/ui';

import { MainSidebarItem } from '../application';
import { useApp } from '../hooks/app';
import useCurrentBot from '../hooks/bots';

const items: MainSidebarItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    regex: /^\/$/,
  },
  {
    label: 'Analytics',
    icon: ChartAreaIcon,
    path: '/analytics',
    regex: /^\/analytics$/,
  },
  {
    label: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/marketplace',
    regex: /^\/marketplace$/,
  },
  // {
  //   label: 'Workflows',
  //   icon: WorkflowIcon,
  //   path: '/workflows',
  //   regex: /^\/workflows/,
  // },
  {
    label: 'Settings',
    icon: Settings2Icon,
    path: '/settings',
    regex: /^\/settings/,
  },
];

function MainSidebarItem({
  path,
  isActive,
  Icon,
  item,
}: {
  path: string;
  isActive: boolean;
  Icon: LucideIcon;
  item: (typeof items)[0];
}) {
  return (
    <Tooltip delayDuration={0}>
      <Link
        to={path}
        className="flex items-center justify-center cursor-default"
        draggable="false"
      >
        <TooltipTrigger
          className={
            `p-3 rounded-xl cursor-default ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-neutral-500/10 text-black/70 dark:text-white'
            }` + `transition-all duration-150`
          }
        >
          <Icon
            size={24}
            className={
              isActive ? 'text-primary' : 'text-black/70 dark:text-white/70'
            }
          />
        </TooltipTrigger>
      </Link>
      <TooltipContent side="right" sideOffset={10}>
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function Sidebar() {
  const app = useApp();
  const params = useParams();
  const location = useLocation();
  const bot = useCurrentBot();

  return (
    <div className="w-24 h-full flex flex-col bg-card overflow-hidden border-r">
      <div className="w-full min-h-20 flex items-center justify-center border-b">
        <Link to="/" draggable="false">
          <img
            src="/logo.svg"
            alt="botmate"
            className="h-14 rounded-2xl hover:shadow-lg transition-all duration-150"
            draggable="false"
          />
        </Link>
      </div>

      <div className="flex flex-col py-4 gap-1 h-full overflow-auto">
        <TooltipProvider>
          {[
            ...items,
            ...(app.sidebar.length > 0 ? ['', ...app.sidebar] : []),
          ].map((item, index) => {
            if (typeof item === 'string') {
              return <div key={index} className="h-px bg-muted/80 mx-5 my-2" />;
            }

            const Icon = item.icon;
            const relativePath = location.pathname.replace(/^\/bots\/\w+/, '');
            const isActive = item.regex
              ? item.regex.test(relativePath || '/')
              : item.path === relativePath;

            const absolutePath = `/bots/${params.botId}${item.path}`;

            return (
              <MainSidebarItem
                key={index}
                path={absolutePath}
                isActive={isActive}
                Icon={Icon}
                item={item}
              />
            );
          })}
        </TooltipProvider>
      </div>
      <div
        className="relative flex items-center justify-center py-4"
        role="group"
      >
        <img
          src={`/${bot.avatar}`}
          alt="botmate"
          className="w-[3.5rem] rounded-2xl cursor-default"
          draggable="false"
        />
      </div>
    </div>
  );
}

export default Sidebar;
