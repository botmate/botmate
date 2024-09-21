import React, { useMemo } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@botmate/ui';
import { toast } from 'sonner';

import { useMediaQuery } from '../hooks/utils';
import { trpc } from '../trpc';

type Props = {
  children: React.ReactNode;
};
function AddNewBotButton({ children }: Props) {
  const createBot = trpc.createBot.useMutation();
  const { data: platforms } = trpc.getPlatformList.useQuery();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [selectedPlatform, setSelectedPlatform] = React.useState<string | null>(
    null,
  );

  const fields = useMemo(() => {
    if (!platforms) return [];
    if (!selectedPlatform) return [];
    const platform = platforms.find((p) => p.name === selectedPlatform);
    if (!platform) return [];
    return Object.entries(platform.credentials).map(([key, value]) => ({
      key,
      description: value.description,
    }));
  }, [platforms, selectedPlatform]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();

    const platform = platforms?.find((p) => p.name === selectedPlatform);
    const credentials = Object.fromEntries(
      fields.map((field) => [
        field.key,
        formData.get(`credentials.${field.key}`),
      ]),
    );
    if (!platform) {
      toast.error('Please select a platform');
      return;
    }

    createBot
      .mutateAsync({
        platform: platform.name,
        credentials,
      })
      .then(() => {
        toast.success('Bot added successfully');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const Form = (
    <div className="grid gap-4 py-4 px-4 lg:px-0">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="lg:text-right">
          Platform
        </Label>
        <Select
          name="platform"
          value={selectedPlatform ?? ''}
          onValueChange={(platform) => {
            setSelectedPlatform(platform);
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={'Select a platform'} />
          </SelectTrigger>
          <SelectContent>
            {platforms?.map((platform) => (
              <SelectItem
                value={platform.name}
                key={platform.name}
                className="capitalize"
              >
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fields.map((field) => (
        <div key={field.key} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={field.key} className="lg:text-right capitalize">
            {field.key}
          </Label>
          <Input
            id={field.key}
            className="col-span-3"
            name={`credentials.${field.key}`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleFormSubmit}>
              <DialogHeader>
                <DialogTitle>Add a new bot</DialogTitle>
                <DialogDescription>
                  Please select your bot platform and enter the credentials.
                </DialogDescription>
              </DialogHeader>
              {Form}
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>{children}</DrawerTrigger>
          <DrawerContent>
            <form onSubmit={handleFormSubmit}>
              <DrawerHeader className="text-left">
                <DrawerTitle>Add a new bot</DrawerTitle>
                <DrawerDescription>
                  Please select your bot platform and enter the credentials.
                </DrawerDescription>
              </DrawerHeader>
              {Form}
              <DrawerFooter className="pt-2 flex-row justify-evenly">
                <Button className="w-full" type="submit">
                  Submit
                </Button>
                <DrawerClose asChild>
                  <Button className="w-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default AddNewBotButton;
