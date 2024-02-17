import { PlatformList } from '#lib/platforms/list';
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
import { Label } from '#ui/label';
import React, { useState } from 'react';

import Image from 'next/image';

type Props = {
  open: boolean;
  close: () => void;
};
function AddBotModal({ open, close }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState(PlatformList[0]);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add bot</DialogTitle>
          <DialogDescription>
            Select your platform and enter your bot credentials
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {PlatformList.map((platform) => {
              return (
                <div
                  key={platform.id}
                  className={`flex flex-col items-center p-3 border-2 rounded-xl bg-neutral-100 ${
                    selectedPlatform.id === platform.id
                      ? 'border-primary-700'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={32}
                    height={32}
                  />
                  <h2 className="text-lg font-semibold">{platform.name}</h2>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            {selectedPlatform.credentials.map((credential) => {
              return (
                <React.Fragment key={credential.id}>
                  <Label htmlFor={credential.id} className="text-right">
                    {credential.title}
                  </Label>
                  <Input
                    id={credential.id}
                    placeholder={credential.message}
                    className="col-span-3"
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddBotModal };
