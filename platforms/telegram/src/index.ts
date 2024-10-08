import { BotInfo, Platform, PlatformAnalytics } from '@botmate/platform';
import axios from 'axios';
import dayjs from 'dayjs';
import { writeFile } from 'fs/promises';
import { Bot } from 'grammy';
import { join } from 'path';

import { setupAnalytics } from './analytics';
import { TelegramAnalyticsModel } from './analytics.model';
import { TelegramChatModel } from './chats.model';
import { TelegramRepository } from './repository';
import { Action, actions } from './workflow.actions';
import { Event, events } from './workflow.events';

function getUploadPath() {
  let storagePath = process.env.STORAGE_PATH;
  if (storagePath) {
    return join(storagePath, 'uploads');
  }
  if (!storagePath) {
    storagePath = join(process.cwd(), 'storage/uploads');
  }
  return storagePath;
}

export class Telegram extends Platform<Bot> {
  name = 'Telegram';
  instance: Bot;
  workflows: Map<
    string,
    {
      botId: string;
      event: string;
      steps: string[];
      values: Array<Record<string, string>>;
    }
  > = new Map();

  constructor(private _credentials: Record<string, string>) {
    super();
    this.instance = new Bot(this._credentials.token);
  }

  async getBotInfo(): Promise<BotInfo> {
    const me = await this.instance.api.getMe();

    let avatar = '';
    const profilePhotos = await this.instance.api.getUserProfilePhotos(me.id);

    if (profilePhotos.photos.length > 0) {
      const file = await this.instance.api.getFile(
        profilePhotos.photos[0][0].file_id,
      );
      const url = `https://api.telegram.org/file/bot${this._credentials.token}/${file.file_path}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const buffer = await response.data;
      const storagePath = getUploadPath();
      const filename = join(storagePath, `${me.id}.jpg`);
      await writeFile(filename, buffer);

      avatar = `uploads/${me.id}.jpg`;
    }

    return {
      id: me.id.toString(),
      name: me.first_name,
      raw: me,
      avatar,
    };
  }

  async init() {
    await setupAnalytics(this.instance);

    this.instance.use(async (ctx, next) => {
      next();

      // analytics
      if (
        ctx.chat?.type === 'group' ||
        ctx.chat?.type === 'supergroup' ||
        ctx.chat?.type === 'channel'
      ) {
        const exist = await TelegramChatModel.exists({ id: ctx.chat.id });
        if (!exist) {
          const admins = await ctx.getChatAdministrators();
          const totalMembers = await ctx.getChatMemberCount();
          await TelegramChatModel.create({
            id: ctx.chat.id,
            title: ctx.chat.title,
            totalMembers,
            admins,
            type: ctx.chat.type,
          });
        }
      }

      if (!ctx.message) return;

      // todo: make values strictly typed
      async function runAction(action: Action, values: Record<string, string>) {
        switch (action) {
          case 'send_message': {
            await ctx.reply(values.text, {
              reply_parameters: {
                message_id: ctx.message!.message_id,
              },
            });
          }
        }
      }

      // workflows
      for (const [, value] of this.workflows) {
        const event = value.event as Event;
        switch (event) {
          case 'message': {
            if (ctx.message.text) {
              const steps = value.steps as Action[];
              let c = 0;
              for (const step of steps) {
                await runAction(step, value.values[c]);
                c++;
              }
            }
          }
        }
      }
    });
  }

  async start() {
    this.instance.start({
      drop_pending_updates: true,
    });
  }
  async stop() {
    await this.instance.stop();
  }

  static getWorflowEvents() {
    return events;
  }

  static getWorflowActions() {
    return actions;
  }

  static async getAnalytics(
    from = dayjs().subtract(1, 'week').toDate(),
    to = new Date(),
  ): Promise<PlatformAnalytics[]> {
    const data: PlatformAnalytics[] = [];

    const analyticsData = await TelegramAnalyticsModel.find();

    data.push({
      type: 'card',
      title: 'Total Messages',
      startTime: from,
      endTime: to,
      value: analyticsData.filter((d) => d.type === 'text').length.toString(),
      description: 'Total messages sent to your bot',
    });

    return data;
  }
}

export default Telegram;

export { ITelegramChat } from './chats.model';
export const repository = new TelegramRepository();
