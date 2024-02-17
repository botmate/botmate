'use client';

import { MenuItem } from '#types';
import { HiOutlineChartBar, HiOutlineHome } from 'react-icons/hi';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items: MenuItem[] = [
  {
    label: 'Home',
    path: '/bots',
    icon: HiOutlineHome,
  },
  {
    label: 'Analytics',
    path: '/bots/analytics',
    icon: HiOutlineChartBar,
  },
];

type Props = {};
function MainMenu({}: Props) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b-2">
      {items.map((item) => {
        const active = !item.exact
          ? pathname === item.path
          : pathname.startsWith(item.path);
        return (
          <Link key={item.path} href={item.path}>
            <div
              className={`flex items-center gap-2 p-2 border-b-4 cursor-pointer ${
                active
                  ? 'border-primary'
                  : 'border-transparent text-gray-500 hover:opacity-80'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
      <div className="flex-1" />
    </div>
  );
}

export { MainMenu };
