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

export class Discord extends Platform<Client> {
  name = 'Discord';
  instance: Client;

  constructor(private _credentials: Record<string, string>) {
    super();
    this.instance = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.instance.login(_credentials.token);
  }

  async getBotInfo(): Promise<BotInfo> {
    const client = this.instance!;

    return new Promise((resolve, reject) => {
      client.once('ready', async (client) => {
        this.instance = client;

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
