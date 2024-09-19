import { BotInfo, Platform } from '@botmate/platform';
import { App as SlackApp } from '@slack/bolt';
import axios from 'axios';
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

export class Slack extends Platform<SlackApp> {
  name = 'Slack';
  instance: SlackApp;

  constructor(private _credentials: Record<string, string>) {
    super();
    this.instance = new SlackApp({
      token: _credentials.token,
      signingSecret: _credentials.signingSecret,
    });
    // this.instance.start();
  }

  async getBotInfo(): Promise<BotInfo> {
    const instance = this.instance;

    return new Promise((resolve, reject) => {
      instance.client.auth.test().then((res) => {
        console.log('res', res);
        instance.client.bots
          .info({
            bot: res.bot_id,
          })
          .then(async (res) => {
            if (!res.bot || !res.bot.id || !res.bot.name) {
              return reject('Bot not found');
            }

            let avatar = '';

            const url = res.bot.icons?.image_48 || '';
            const response = await axios.get(url, {
              responseType: 'arraybuffer',
            });

            const buffer = await response.data;
            const storagePath = getUploadPath();
            const filename = join(storagePath, `${res.bot.id}.jpg`);
            await writeFile(filename, buffer);

            avatar = `uploads/${res.bot.id}.jpg`;

            const info: BotInfo = {
              id: res.bot.id,
              name: res.bot.name,
              raw: res.bot,
              avatar,
            };

            resolve(info);
          });
      });
    });
  }

  async start() {
    this.instance.start();
  }

  async stop() {
    this.instance.stop();
  }
}

export default Slack;
