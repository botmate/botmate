import React, { useMemo } from 'react';

import {
  Link,
  SidebarItem,
  SidebarLayout,
  toast,
  useCurrentBot,
  usePluginRPC,
  usePluginRPCMutation,
  useSearchParams,
} from '@botmate/client';
import { Button, Editor, PageLayout } from '@botmate/ui';
import { InlineKeyboardButton } from 'grammy/types';

import type { RPC } from '../server';
import KeyboardBuilder from './keyboard-builder';

function Page() {
  const bot = useCurrentBot();
  const [searchParams] = useSearchParams();

  const telegramChats = usePluginRPC<RPC>('getTelegramChats', 1);
  const postMessage = usePluginRPCMutation<RPC>('postMessage');

  const chatId = searchParams.get('chat');

  const chatData = useMemo(() => {
    return telegramChats?.find((chat) => chat.id === chatId);
  }, [chatId, telegramChats]);

  const [text, setText] = React.useState('');
  const [keyboard, setKeyboard] = React.useState<
    InlineKeyboardButton.UrlButton[][]
  >([]);

  return (
    <SidebarLayout
      title="Telegram Post"
      items={[
        <h1 className={`text-gray-600 dark:text-neutral-500 text-sm uppercase`}>
          Select a chat
        </h1>,
        ...(telegramChats?.map((chat) => (
          <Link
            key={chat.id}
            to={`/bots/${bot._id}/telegram-post?chat=${chat.id}`}
          >
            <SidebarItem
              key={chat.id}
              title={chat.title}
              active={chatId === chat.id}
            />
          </Link>
        )) || []),
      ]}
      footer={
        <>
          <Button
            onClick={() => {
              toast('Coming soon');
            }}
            variant="link"
          >
            View recent posts
          </Button>
        </>
      }
    >
      {chatData ? (
        <PageLayout title={chatData.title}>
          <div className="space-y-4">
            <Editor onChange={setText} placeholder="Write your message here" />
            <KeyboardBuilder onChange={setKeyboard} />
            <Button
              onClick={() => {
                postMessage.mutateAsync({
                  chatId: chatData.id,
                  text: text,
                  keyboard: keyboard,
                });
              }}
              isLoading={postMessage.isLoading}
            >
              Post Message
            </Button>
          </div>
        </PageLayout>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1>Select a chat to continue</h1>
        </div>
      )}
    </SidebarLayout>
  );
}

export default Page;
