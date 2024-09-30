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

export const pluginSchema = new Schema<IPlugin>(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String, required: true },
    dependencies: { type: Object, required: true },
    botId: { type: String, required: true },
    config: { type: Object, default: {} },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const PluginModel = model<IPlugin>('plugins', pluginSchema);
