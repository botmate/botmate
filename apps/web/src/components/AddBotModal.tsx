import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { Platform, PLATFORMS } from '@botmate/platforms';
import { useState } from 'react';
import { FormBuilder } from './FormBuilder';
import { useForm } from 'react-hook-form';
import { trpc } from '@web/trpc/client';
import { toast } from 'sonner';

type PlatformItemProps = {
  platform: Platform;
  selected?: boolean;
  onClick?: () => void;
};
const PlatformItem = ({ platform, onClick, selected }: PlatformItemProps) => {
  const { name, icon: Icon } = PLATFORMS[platform];

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-4 bg-slate-50 border rounded-xl
      ${selected ? 'opacity-100' : 'opacity-50'}`}
      onClick={onClick}
    >
      <Icon size={20} />
      <h2 className="pointer-events-none font-bold mt-1 text-lg">{name}</h2>
    </div>
  );
};

type AddBotModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
function AddBotModal({ isOpen, onOpenChange }: AddBotModalProps) {
  const form = useForm();
  const [selected, setSelected] = useState<Platform>('telegram');
  const createBot = trpc.createBot.useMutation();

  async function handleSubmit(data: Record<string, string>) {
    try {
      await createBot.mutateAsync({
        platform: selected,
        credentials: data,
      });
      toast.success('Bot created successfully');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      toast.error('An error occurred');
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Add new bot
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div className="flex justify-evenly gap-4">
                  {Object.keys(PLATFORMS).map((platform) => (
                    <PlatformItem
                      key={platform}
                      platform={platform as Platform}
                      onClick={() => {
                        setSelected(platform as Platform);
                      }}
                      selected={selected === platform}
                    />
                  ))}
                </div>

                <div>
                  {selected ? (
                    <div className="space-y-4">
                      <FormBuilder
                        form={form}
                        inputs={PLATFORMS[selected].inputs}
                      />

                      <p className="text-sm text-slate-500">
                        {PLATFORMS[selected].info}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                disableRipple
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                disableRipple
                color="primary"
                isLoading={createBot.isLoading}
              >
                Confirm
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

export { AddBotModal };
