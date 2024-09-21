import { Schema, model } from 'mongoose';

export type IBot = {
  id: string;
  name: string;
  platformType: string;
  raw: Record<string, unknown>;
  credentials: Record<string, string>;
  config: Record<string, unknown>;
  avatar: string;
  enabled: boolean;
};

export type SafeBot = IBot & { _id: string };

export const botSchema = new Schema<IBot>({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  platformType: { type: String, required: true },
  raw: { type: Object, required: true },
  credentials: { type: Object, required: true },
  config: { type: Object, default: {} },
  avatar: { type: String },
  enabled: { type: Boolean, default: true },
});

export const BotModel = model<IBot>('bots', botSchema);

// import {
//   boolean,
//   json,
//   pgEnum,
//   pgTable,
//   serial,
//   varchar,
// } from 'drizzle-orm/pg-core';

// export const platformType = pgEnum('platform', [
//   'telegram',
//   'discord',
//   'slack',
// ]);

// export const botStatus = pgEnum('bot_status', [
//   'active',
//   'inactive',
//   'deleted',
// ]);

// export const bots = pgTable('bots', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }).notNull(),
//   bot_id: varchar('bot_id', { length: 256 }).notNull(),
//   platform_type: platformType('platform_type').notNull(),
//   raw: json('raw').notNull(),
//   credentials: json('credentials').notNull(),
//   config: json('config').default({}),
//   avatar: varchar('avatar', { length: 256 }),
//   enabled: boolean('enabled').default(true),
// });

// export type BotSchema = typeof bots.$inferSelect;
