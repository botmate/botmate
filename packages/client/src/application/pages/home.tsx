import { MoonIcon, PlusIcon, SunIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@botmate/ui';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import AddNewBotButton from '../components/add-new-bot';
import { useApp } from '../hooks/use-app';
import { trpc } from '../trpc';

function HomePage() {
  const app = useApp();
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = trpc.listBots.useQuery();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    app.pluginSettings.clear();
  }, [theme]);

  useEffect(() => {
    const items = document.querySelectorAll('[data-item]');
    if (items.length > 0) {
      items.forEach((item) => {
        const name = item.querySelector('#name');
        const nameParent = name?.parentElement;

        if (name && nameParent) {
          if (name.scrollWidth > nameParent.clientWidth) {
            setTimeout(() => {
              name.classList.add('animate-marquee');
            }, 1000);
          }
        }
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="/logo.svg"
          alt="Loading..."
          className="w-16 h-16 animate-pulse rounded-2xl"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="flex lg:items-center h-screen">
      <motion.div className="xl:w-[1200px] lg:min-h-[600px] lg:mx-auto w-full flex flex-col p-6 lg:p-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Home</h1>
            <p className="text-muted-foreground">
              Here are the list of bots that you have added
            </p>
          </div>
          <div className="space-x-1">
            <Button
              variant="ghost"
              className="rounded-full p-3"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-6">
          {data?.map((bot, index) => (
            <Link
              key={bot._id}
              to={`/bots/${bot._id}`}
              className="max-w-24 text-ellipsis hover:scale-95 transition-all duration-150"
              draggable="false"
              data-item
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.07 * index }}
                className="space-y-1"
              >
                <img
                  src={`/${bot.avatar}`}
                  alt={bot.name}
                  className="rounded-3xl w-24 h-24"
                  draggable="false"
                />
                <div className="pl-1 overflow-hidden whitespace-nowrap">
                  <h2 className="font-normal inline-block" id="name">
                    {bot.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {bot.id}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
          <AddNewBotButton>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.07 * (data?.length || 0) }}
            >
              <div className="h-24 w-24 p-4 flex items-center justify-center border bg-background border-gray rounded-3xl hover:-translate-y-1 transition-all duration-150 cursor-pointer">
                <PlusIcon />
              </div>
            </motion.div>
          </AddNewBotButton>
        </div>
        <div className="flex-1" />
        <div>
          <span className="text-sm text-black/50 dark:text-white/50">
            botmate (v{app.version})
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
