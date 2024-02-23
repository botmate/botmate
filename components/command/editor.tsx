import { parseCondition } from '#lib/command';
import { Button } from '#ui/button';
import { Card } from '#ui/card';
import { Input } from '#ui/input';
import { Switch } from '#ui/switch';
import { Tooltip } from '#ui/tooltip';
import { Command } from '@prisma/client';
import {
  HammerIcon,
  LucideDelete,
  LucidePlay,
  LucideTrash,
  LucideTrash2,
} from 'lucide-react';
import React from 'react';
import { HiOutlinePlay, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi';

import PageLayout from '#components/layouts/page';

import ActionBuilder from './action-builder';
import { ActionList } from './data';

type Props = {
  command: Command;
};
function CommandEditor({ command }: Props) {
  const { name } = command;

  const condition = parseCondition(command.condition);

  return (
    <PageLayout
      title={name}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip title="Condition">
            <Button variant="ghost">
              <HammerIcon size={20} />
            </Button>
          </Tooltip>

          <Tooltip title="Delete">
            <Button variant="ghost">
              <LucideTrash2 size={20} />
            </Button>
          </Tooltip>

          <Tooltip title="Delete">
            <Button variant="ghost">
              <LucideTrash2 size={20} />
            </Button>
          </Tooltip>
        </div>
      }
    >
      <ActionBuilder />
      {/* <div className="grid grid-cols-12 h-full">
        <div className="col-span-8 p-4 border-r">
          <div className="flex flex-col max-w-lg mx-auto">
            <div className="flex justify-center">
              <Button>/start</Button>
            </div>

            <div className="flex justify-center">
              <div className="h-6 w-[0.5px] bg-gray-200" />
            </div>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <h1>Send Text</h1>
                <p>Send a message to the user</p>
              </div>
              <div>
                <Button variant="outline">Edit</Button>
              </div>
            </Card>

            <div className="flex justify-center">
              <div className="h-6 w-[0.5px] bg-gray-200" />
            </div>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <h1>Send Sticker</h1>
                <p>Send a sticker message</p>
              </div>
              <div>
                <Button variant="outline">Edit</Button>
              </div>
            </Card>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col">
            <div className="p-4 border-b">
              <Input placeholder="Search action" />
            </div>
            <div className="mt-4 space-y-2 p-2">
              {ActionList.map((action, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 hover:bg-primary hover:text-primary-foreground p-2 text-sm rounded-md`}
                >
                  {action.icon ? (
                    <div className="p-2 bg-primary text-primary-foreground rounded-md">
                      <action.icon size={20} />
                    </div>
                  ) : null}
                  <div>
                    <h1>{action.name}</h1>
                    <p className="text-sm">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </PageLayout>
  );
}

export default CommandEditor;
