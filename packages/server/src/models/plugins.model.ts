import { Schema, model } from 'mongoose';

export interface IPlugin {
  _id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  botId: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

export const pluginSchema = new Schema<IPlugin>({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, required: true },
  dependencies: { type: Object, required: true },
  botId: { type: String, required: true },
  config: { type: Object, default: {} },
  enabled: { type: Boolean, default: true },
});

export const PluginModel = model<IPlugin>('plugins', pluginSchema);

// import { json, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

// export const plugins = pgTable('plugins', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 128 }),
//   display_name: varchar('display_name', { length: 128 }),
//   version: varchar('version', { length: 16 }),
//   description: varchar('description', { length: 256 }),
//   dependencies: json('dependencies'),
//   bot_id: varchar('bot_id', { length: 128 }),
//   config: json('config'),
//   created_at: timestamp('created_at').notNull().defaultNow(),
//   updated_at: timestamp('updated_at').$onUpdate(() => new Date()),
// });

// export type PluginSchema = typeof plugins.$inferSelect;
