'use client';

import { Button } from '@nextui-org/react';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

function BackButton() {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      onClick={() => {
        router.back();
      }}
      variant="light"
      disableRipple
    >
      <ArrowLeftIcon />
    </Button>
  );
}

export { BackButton };
