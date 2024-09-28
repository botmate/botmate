import { PlatformAnalytics, PlatformType } from '@botmate/platform';
import { z } from 'zod';

import { Application } from '../application';
import { Bot } from '../bot';
import { authedProcedure } from './_trpc';

export class PlatformAnalyticsService {
  constructor(private app: Application) {}

  async getAnalytics(platform: PlatformType) {
    const _platform = await Bot.importPlatform(platform);
    const data = await _platform.getAnalytics();
    return data as PlatformAnalytics[];
  }

  getRoutes() {
    return {
      getAnalytics: authedProcedure
        .input(
          z.object({
            platform: z.string(),
          }),
        )
        .query(({ input }) => {
          return this.getAnalytics(input.platform as PlatformType);
        }),
    };
  }
}
