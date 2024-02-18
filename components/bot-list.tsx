'use client';

import { trpc } from '#lib/trpc/client';
import { Spinner } from '#ui/spinner';
import { Bot } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import BotCard from './bot-card';

function BotList() {
  const getBots = trpc.getBots.useQuery();

  if (getBots.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {getBots.data?.map((bot, index) => (
          <motion.div
            key={bot.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              delay: (index + 1) * 0.05,
              duration: 0.23,
              ease: 'easeInOut',
              stiffness: 500,
              damping: 50,
              type: 'spring',
            }}
          >
            <BotCard id={bot.id} name={bot.name} onDelete={() => {}} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default BotList;
