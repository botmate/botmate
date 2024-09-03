import {
  ChartAreaIcon,
  LayoutDashboard,
  Settings2Icon,
  ShoppingBagIcon,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@botmate/ui';

import useCurrentBot from '../hooks/use-bot';

const items = [
  {
    id: 1,
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    regex: /^\/$/,
  },
  {
    id: 2,
    title: 'Analytics',
    icon: ChartAreaIcon,
    path: '/analytics',
    regex: /^\/analytics$/,
  },
  {
    id: 3,
    title: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/marketplace',
    regex: /^\/marketplace$/,
  },
  {
    id: 4,
    title: 'Settings',
    icon: Settings2Icon,
    path: '/settings',
    regex: /^\/settings/,
  },
];

function Sidebar() {
  const params = useParams();
  const location = useLocation();
  const bot = useCurrentBot();

  return (
    <div className="w-24 h-full bg-card flex flex-col py-3">
      <div className="w-full h-20 flex items-center justify-center">
        <Link to="/" draggable="false">
          <img
            src="/logo.svg"
            alt="botmate"
            className="w-[3.5rem] rounded-2xl hover:-translate-y-1 transition-all duration-150 shadow-lg"
            draggable="false"
          />
        </Link>
      </div>

      <div className="flex flex-col py-4 gap-1 h-full">
        {items.map((item) => {
          const Icon = item.icon;
          const relativePath = location.pathname.replace(/^\/bots\/\d+/, '');
          const isActive = item.regex.test(relativePath || '/');

          const absolutePath = `/bots/${params.id}${item.path}`;

          return (
            <TooltipProvider key={item.id}>
              <Tooltip delayDuration={0}>
                <Link
                  to={absolutePath}
                  className="flex items-center justify-center cursor-default"
                  draggable="false"
                >
                  <TooltipTrigger
                    className={
                      `p-3 rounded-xl cursor-default ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 text-black/70'}` +
                      `transition-all duration-150`
                    }
                  >
                    <Icon
                      size={24}
                      className={isActive ? 'text-primary' : 'text-black/70'}
                    />
                  </TooltipTrigger>
                </Link>
                <TooltipContent side="right" sideOffset={10}>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        <div className="flex-1" />
        <div className="relative flex items-center justify-center" role="group">
          <img
            src={`${process.env.ENDPOINT}/${bot.avatar}`}
            alt="botmate"
            className="w-[3.5rem] rounded-2xl cursor-default"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
