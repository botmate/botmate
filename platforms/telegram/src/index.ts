import { BotInfo, Platform } from '@botmate/platform';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { Bot } from 'grammy';
import { join } from 'path';

import { actions } from './workflow.actions';
import { events } from './workflow.events';

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

  async start() {
    this.instance.start();
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
}

export default Telegram;
