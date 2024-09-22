import { useEffect, useState } from 'react';
import React from 'react';

import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer';

export function useMediaQuery(query: string) {
  const mediaQuery = window.matchMedia(query);
  const [matches, setMatches] = useState(mediaQuery.matches);

  useEffect(() => {
    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  return matches;
}

type Props = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};
export function ResponsiveDialog(props: Props) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return isDesktop ? (
    <Dialog
      open={props.open}
      onOpenChange={(v) => {
        if (!v) props.onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className={props.className}>{props.children}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={props.open}
      onOpenChange={(v) => {
        if (!v) props.onClose();
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <div className={`px-4 ${props.className}`}>{props.children}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
