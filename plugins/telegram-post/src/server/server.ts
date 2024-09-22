import { repository } from '@botmate/platform-telegram';
import { PlatformType, Plugin } from '@botmate/server';
import { Bot } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';

export class TelegramPost extends Plugin {
  rpc = getRPC(this);
  displayName = 'Telegram Post';
  platformType = PlatformType.Telegram;
}

type PostMessageParams = {
  chatId: string;
  text: string;
  keyboard?: InlineKeyboardButton.UrlButton[][];
};

const getRPC = (plugin: TelegramPost) => ({
  getTelegramChats: async (pageNo: number) => {
    const chats = await repository.getChats(pageNo);
    return chats.map((chat) => chat.toObject());
  },
  postMessage: async (params: PostMessageParams) => {
    try {
      const instance = plugin.bot.instance<Bot>();
      await instance.api.sendMessage(params.chatId, params.text, {
        reply_markup: params.keyboard
          ? {
              inline_keyboard: params.keyboard,
            }
          : undefined,
        parse_mode: 'HTML',
      });
      plugin.sendClientMessage('Message sent');
    } catch (e) {
      console.error(e);
      plugin.sendClientMessage('Failed to send message', 'error');
    }
  },
});

export type RPC = ReturnType<typeof getRPC>;
