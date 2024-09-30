import { PlatformType } from '@botmate/platform';
import { WorkflowEvent } from '@botmate/platform';
import { WorkflowAction } from '@botmate/platform';

import { Application } from '../application';
import { Bot } from '../bot';
import { WorkflowModel } from '../models/workflows.model';

export class WorkflowManager {
  constructor(private app: Application) {}

  async init() {
    const wfs = await WorkflowModel.find();
    for (const wf of wfs) {
      const bot = await this.app.botsService.getBot(wf.botId);
      if (bot) {
        const botInstance = this.app.botManager.bots.get(bot._id.toString());
        const botWf = botInstance?.workflows;
        if (botWf) {
          botWf.set(wf._id.toString(), {
            botId: bot._id.toString(),
            event: wf.event,
            steps: wf.steps,
            values: wf.values,
          });
        }
      }
    }
  }

  async getEvents(platform: string) {
    if (platform === 'telegram') {
      try {
        const _import = await Bot.importPlatform(PlatformType.Telegram);
        return _import.getWorflowEvents() as WorkflowEvent[];
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
        return _import.getWorflowActions() as WorkflowAction[];
      } catch (e) {
        const msg = `Platform not found, or the platform does not have workflow actions`;
        throw new Error(msg);
      }
    }
  }
}
