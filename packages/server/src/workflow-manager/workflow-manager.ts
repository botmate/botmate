import { PlatformType } from '@botmate/platform';

import { Application } from '../application';
import { Bot } from '../bot';

export class WorkflowManager {
  constructor(private app: Application) {}

  async getEvents(platform: string) {
    if (platform === 'telegram') {
      try {
        const _import = await Bot.importPlatform(PlatformType.Telegram);
        return _import.getWorflowEvents();
      } catch (e) {
        const msg = `Platform not found, or the platform does not have workflow events`;
        throw new Error(msg);
      }
    }
  }

  async getActions(platform: string) {
    if (platform === 'telegram') {
      try {
        const _import = await Bot.importPlatform(PlatformType.Telegram);
        return _import.getWorflowActions();
      } catch (e) {
        const msg = `Platform not found, or the platform does not have workflow actions`;
        throw new Error(msg);
      }
    }
  }
}
