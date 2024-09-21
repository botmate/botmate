import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from '@botmate/database';

export interface AppDatabase {
  bots: BotTable;
}

export interface BotTable {
  id: Generated<number>;
  name: ColumnType<string>;
  bot_id: ColumnType<string>;
  platform_type: ColumnType<string>;
  raw: JSONColumnType<Record<string, unknown>>;
  credentials: JSONColumnType<Record<string, string>>;
  config: JSONColumnType<Record<string, unknown>>;
  avatar: ColumnType<string>;
  enabled: ColumnType<boolean>;
}

export type IBot = Selectable<BotTable>;
export type InsertBot = Insertable<BotTable>;
export type UpdateBot = Updateable<BotTable>;
