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

export const botSchema = new Schema<IBot>(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    platformType: { type: String, required: true },
    raw: { type: Object, required: true },
    credentials: { type: Object, required: true },
    config: { type: Object, default: {} },
    avatar: { type: String },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const BotModel = model<IBot>('bots', botSchema);
