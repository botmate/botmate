import { MoonIcon, PlusIcon, SunIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@botmate/ui';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { useApp } from '../hooks/use-app';
import { useGetBotsQuery } from '../services';

function HomePage() {
  const app = useApp();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useGetBotsQuery();

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

  if (data?.length === 0) {
    navigate('/setup');
  }

  return (
    <div className="flex items-center h-screen">
      <motion.div className="w-[1200px] h-[600px] 2xl:h-[800px] mx-auto bg-card rounded-3xl p-12 border flex flex-col">
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
              key={bot.id}
              to={`/bots/${bot.id}`}
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
                    {bot.botId}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.07 * (data?.length || 0) }}
          >
            <Link to="/setup" draggable="false">
              <div className="h-24 w-24 p-4 flex items-center justify-center border bg-background border-gray rounded-3xl hover:-translate-y-1 transition-all duration-150 cursor-pointer">
                <PlusIcon />
              </div>
            </Link>
          </motion.div>
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
