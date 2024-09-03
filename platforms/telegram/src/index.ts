import { BotInfo, Platform } from '@botmate/platform';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { Bot } from 'grammy';
import { join } from 'path';

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

export class Telegram extends Platform {
  name = 'Telegram';

  async getBotInfo(credentials: Record<string, string>): Promise<BotInfo> {
    if (!credentials.token) {
      throw new Error('Token is required');
    }

    const bot = new Bot(credentials.token);
    const me = await bot.api.getMe();

    let avatar = '';
    const profilePhotos = await bot.api.getUserProfilePhotos(me.id);

    if (profilePhotos.photos.length > 0) {
      const file = await bot.api.getFile(profilePhotos.photos[0][0].file_id);
      const url = `https://api.telegram.org/file/bot${credentials.token}/${file.file_path}`;
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
}

export default Telegram;
