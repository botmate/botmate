import { Schema, model } from '@botmate/server';

export type ITelegramAnalytics = {
  fromId: string;
  type: string;
  chatId: string;
  botId: string;
  timestamp: Date;
};

const telegramAnalyticsSchema = new Schema<ITelegramAnalytics>(
  {
    fromId: { type: String, required: true },
    type: { type: String, required: true },
    chatId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    botId: { type: String, required: true },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'botId',
      granularity: 'seconds',
    },
    expireAfterSeconds: 60 * 60 * 24 * 90, // 90 days
  },
);

export const TelegramAnalyticsModel = model<ITelegramAnalytics>(
  'telegram-analytics',
  telegramAnalyticsSchema,
);
