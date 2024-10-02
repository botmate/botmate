import { Schema, model } from 'mongoose';

export interface IWorkflow {
  _id: string;
  name: string;
  botId: string;
  events: Array<Record<string, any>>;
  enabled: boolean;
  reactflow: Record<string, unknown>;
}

export const workflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true },
    botId: { type: String, required: true },
    events: { type: [{ type: Schema.Types.Mixed }], required: true },
    enabled: { type: Boolean, required: true, default: true },
    reactflow: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  },
);

export const WorkflowModel = model<IWorkflow>('workflows', workflowSchema);
