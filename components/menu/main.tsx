'use client';

import { MenuItem } from '#types';
import { Button } from '#ui/button';
import { HiOutlineChartBar, HiOutlineHome, HiPlus } from 'react-icons/hi';
import { useToggle } from 'react-use';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AddBotModal } from '#components/modals';

const items: MenuItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: HiOutlineHome,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: HiOutlineChartBar,
  },
];

type Props = {};
function MainMenu({}: Props) {
  const [addBotModal, toggleAddBotModal] = useToggle(false);
  const pathname = usePathname();

  return (
    <>
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
        <Button size="sm" onClick={toggleAddBotModal}>
          <HiPlus className="mr-1" /> Add bot
        </Button>
      </div>
      <AddBotModal open={addBotModal} close={toggleAddBotModal} />
    </>
  );
}

export { MainMenu };
