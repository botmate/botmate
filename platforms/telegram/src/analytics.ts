import { Bot } from 'grammy';

import { TelegramAnalyticsModel } from './analytics.model';

export async function setupAnalytics(bot: Bot) {
  bot.use(async (ctx, next) => {
    next();
    if (!ctx.message) return;

    let type = ctx.message.text ? 'text' : 'message';

    try {
      const data = {
        type,
        timestamp: new Date(),
        chatId: ctx.chat?.id.toString(),
        fromId: ctx.from?.id.toString(),
        botId: ctx.me.id.toString(),
      };
      await TelegramAnalyticsModel.create(data);
    } catch (e) {
      console.log(e);
    }
  });
}
