'use client';

import { Bot } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import BotCard from './bot-card';

type Props = {
  bots: Bot[];
};
function BotList(props: Props) {
  const [bots, setBots] = useState(props.bots);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
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
            <BotCard
              bot={bot}
              onDelete={() => {
                setBots((prev) => prev.filter((b) => b.id !== bot.id));
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default BotList;
