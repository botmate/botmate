import { activity } from '../lib/activities';
import { Platform } from '@botmate/shared';

export async function createBot(
  userId: string,
  platform: Platform,
  credentials: Record<string, string>,
) {
  try {
    const bot = await activity.createBot({
      userId,
      platform,
      credentials,
    });
    return bot;
  } catch (e) {
    throw new Error(e.description);
    // if (e instanceof GrammyError) {
    //   throw new Error(e.description);
    // }
    // throw e;
  }
}
