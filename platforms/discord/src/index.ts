import { BotInfo, Platform } from '@botmate/platform';
import axios from 'axios';
import { Client, GatewayIntentBits } from 'discord.js';
import { writeFile } from 'fs/promises';
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

export class Discord extends Platform {
  name = 'Discord';

  async getBotInfo(credentials: Record<string, string>): Promise<BotInfo> {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    return new Promise((resolve, reject) => {
      client.login(credentials.token);

      client.once('ready', async () => {
        if (!client.user) {
          reject(new Error('Failed to get user'));
          return;
        }

        const avatar = client.user.displayAvatarURL();

        const uploadPath = getUploadPath();
        const avatarPath = join(uploadPath, `${client.user.id}.png`);
        await writeFile(
          avatarPath,
          await axios
            .get(avatar, { responseType: 'arraybuffer' })
            .then((res) => res.data),
        );

        const info: BotInfo = {
          id: client.user.id,
          name: client.user.username,
          raw: JSON.parse(JSON.stringify(client.user)),
          avatar: `uploads/${client.user.id}.png`,
        };

        resolve(info);
      });
    });
  }
}

export default Discord;
