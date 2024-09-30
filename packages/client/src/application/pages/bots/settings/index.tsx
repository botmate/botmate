import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  PageLayout,
} from '@botmate/ui';
import { toast } from 'sonner';

import useCurrentBot from '../../../hooks/bots';
import { useDeleteBotMutation } from '../../../services';

function GeneralSettingsPage() {
  const bot = useCurrentBot();
  const [deleteBot] = useDeleteBotMutation();
  const navigate = useNavigate();
  return (
    <PageLayout title="General">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-md font-medium">Bot information</h1>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: 'ID',
                value: bot._id,
              },
              {
                title: 'Name',
                value: bot.name,
              },
            ].map((item) => {
              return (
                <div key={item.title} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {item.title}
                  </span>
                  <span className="text-lg">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete bot</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                bot and all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteBot(bot._id)
                    .unwrap()
                    .then(() => {
                      navigate('/');
                      toast.success('Bot deleted successfully');
                    });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
}

export default GeneralSettingsPage;
