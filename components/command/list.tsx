'use client';

import { useCommandStore } from '#store/command';
import { Button } from '#ui/button';
import { Card } from '#ui/card';
import { Tooltip } from '#ui/tooltip';
import { Command } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import PageLayout from '#components/layouts/page';

dayjs.extend(relativeTime);

type Props = {
  commands: Command[];
};
function CommandList(props: Props) {
  const params = useParams();
  const { commands, setCommands } = useCommandStore();

  useEffect(() => {
    setCommands(props.commands);
  }, [props.commands, setCommands]);

  const activeCommandId = params.cmdId;

  return (
    <PageLayout
      title="Commands"
      actions={
        <Tooltip title="Create">
          <Button size="sm" variant={'ghost'}>
            <HiOutlinePlus size={18} />
          </Button>
        </Tooltip>
      }
    >
      <div className="w-80 p-2 space-y-2 border-r h-full">
        <AnimatePresence>
          {commands.map((command, index) => {
            const ago = dayjs(command.updatedAt).fromNow();

            return (
              <motion.div
                key={command.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.08,
                  damping: 10,
                }}
              >
                <Link
                  href={`/bots/${command.botId}/commands/${command.id}`}
                  className="cursor-default"
                >
                  <Card
                    className={`flex items-start p-4 ${
                      command.id === activeCommandId ? 'bg-muted' : ''
                    }`}
                  >
                    <div>
                      <h1 className="font-semibold">{command.alias}</h1>
                      <div className="flex gap-1 mt-2">
                        <div className="py-1 px-2 text-xs bg-primary text-primary-foreground rounded-sm">
                          {/* @ts-ignore */}
                          {command.actions?.length} action
                          {/* @ts-ignore */}
                          {command.actions?.length > 1 ? 's' : ''}
                        </div>
                        <div className="py-1 px-2 text-xs bg-blue-500 text-primary-foreground rounded-sm">
                          {/* @ts-ignore */}
                          {command.condition.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex mt-1">
                      <div className={`text-xs`}>{ago}</div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

export default CommandList;
