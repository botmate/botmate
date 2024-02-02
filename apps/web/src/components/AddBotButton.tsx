'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { PlusIcon } from 'lucide-react';
import { AddBotModal } from './AddBotModal';

function AddBotButton() {
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        disableRipple
        color="primary"
        startContent={<PlusIcon size={20} />}
        onClick={disclosure.onOpenChange}
      >
        Add bot
      </Button>

      <AddBotModal
        isOpen={disclosure.isOpen}
        onOpenChange={disclosure.onOpenChange}
      />
    </>
  );
}

export { AddBotButton };
