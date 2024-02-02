'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, BookIcon, MenuIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import AvatarMenu from './AvatarMenu';
import { Button, Spinner } from '@nextui-org/react';
import logo from '@web/assets/botmate.svg';
import { useAppStore } from '../store/app';

export function AppBar() {
  const pahtname = usePathname();
  const appStore = useAppStore();
  const isRoot = pahtname === '/bots';

  return (
    <div className="border-b-1">
      <div className="flex items-center px-4 gap-4 h-20">
        <Button
          isIconOnly
          disableRipple
          variant="light"
          size="lg"
          className="md:hidden"
        >
          <MenuIcon />
        </Button>

        <Image
          className={`pointer-events-none rounded-xl ${!isRoot ? 'hidden' : 'md:block'}`}
          alt="logo"
          src={logo}
          height={60}
        />

        {!isRoot && (
          <div className="hidden md:flex items-center gap-6">
            <Link href="/bots">
              <ArrowLeftIcon size={30} />
            </Link>
            {appStore.appTitle ? (
              <h1 className="font-extrabold text-3xl">{appStore.appTitle}</h1>
            ) : (
              <Spinner />
            )}
          </div>
        )}

        <div className="flex-1" />
        <div className="gap-2 hidden md:flex">
          <>
            <Button
              disableRipple
              variant="light"
              startContent={<BookIcon size={16} />}
            >
              Docs
            </Button>
            <Button
              disableRipple
              variant="light"
              startContent={<UsersIcon size={16} />}
            >
              Support
            </Button>
          </>
        </div>
        <AvatarMenu />
      </div>
    </div>
  );
}
