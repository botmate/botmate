'use client';

import { trpc } from '#lib/trpc/client';
import { useCommandStore } from '#store/command';
import { Button } from '#ui/button';
import { Card } from '#ui/card';
import { Tooltip } from '#ui/tooltip';
import { Command } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import { SortAscIcon, SortDescIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import PageLayout from '#components/layouts/page';
import NoData from '#components/no-data';

dayjs.extend(relativeTime);

type Props = {
  commands: Command[];
  botId: string;
};
function CommandList(props: Props) {
  const params = useParams();
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const { commands, setCommands } = useCommandStore();

  useEffect(() => {
    setCommands(props.commands);
  }, [props.commands, setCommands]);

  useEffect(() => {
    const copy = [...props.commands];
    if (sort === 'asc') {
      copy.reverse();
    } else {
      copy.sort((a, b) => {
        return dayjs(a.updatedAt).isBefore(dayjs(b.updatedAt)) ? 1 : -1;
      });
    }
    setCommands(copy);
  }, [props.commands, setCommands, sort]);

  const activeCommandId = params.cmdId;

  return (
    <PageLayout
      title="Commands"
      actions={
        <>
          <Tooltip title="Create">
            <Link href={`/bots/${params.id}/commands/create`}>
              <Button size="sm" variant={'ghost'}>
                <HiOutlinePlus size={18} />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title={sort === 'asc' ? 'New First' : 'Old First'}>
            <Button
              size="sm"
              variant={'ghost'}
              onClick={() => {
                setSort(sort === 'asc' ? 'desc' : 'asc');
              }}
            >
              {sort === 'asc' ? (
                <SortDescIcon size={18} />
              ) : (
                <SortAscIcon size={18} />
              )}
            </Button>
          </Tooltip>
        </>
      }
    >
      <div className="w-80 p-2 space-y-2 border-r h-full">
        {props.commands.length === 0 && <NoData title="No Commands" />}
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
                      <h1 className="font-semibold">{command.name}</h1>
                      <p className="text-xs">{command.description}</p>
                      <div className="flex gap-1 mt-3">
                        <div className="py-1 px-2 text-xs bg-primary text-primary-foreground rounded-sm">
                          {/* @ts-ignore */}
                          {command.actions?.length ?? '0'} action
                          {/* @ts-ignore */}
                          {command.actions?.length > 1 ? 's' : ''}
                        </div>
                        <div className="py-1 px-2 text-xs bg-muted rounded-sm">
                          {ago}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
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
