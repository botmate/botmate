import { Schema, model } from '@botmate/server';
import { ChatMemberAdministrator } from 'grammy/types';

export type ITelegramChat = {
  id: string;
  title: string;
  totalMembers: number;
  admins: ChatMemberAdministrator[];
  avatar: string;
  type: 'group' | 'supergroup' | 'channel';
};

export const telegramChatSchema = new Schema<ITelegramChat>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  totalMembers: { type: Number, required: true },
  admins: { type: [Object], required: true },
  avatar: { type: String },
  type: { type: String, required: true },
});

export const TelegramChatModel = model<ITelegramChat>(
  'telegram-chats',
  telegramChatSchema,
);
