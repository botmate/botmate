'use client';

import { trpc } from '#lib/trpc/client';
import { Button } from '#ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#ui/dialog';
import { Input } from '#ui/input';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  close: () => void;
};
function AddBotModal({ open, close }: Props) {
  const utils = trpc.useUtils();
  const addBot = trpc.addBot.useMutation();
  const [token, setToken] = useState('');

  function handleSubmit() {
    addBot
      .mutateAsync({
        token,
      })
      .then(() => {
        utils.getBots.invalidate();
        toast.success('Bot added');
        close();
      });
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter token</DialogTitle>
          <DialogDescription>
            You can get bot token from @BotFather
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            id={'token'}
            placeholder={'203719024:AAGgO9n000000000'}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            isLoading={addBot.isLoading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddBotModal };
