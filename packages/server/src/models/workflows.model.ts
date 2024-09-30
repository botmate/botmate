import { Schema, model } from 'mongoose';

export interface IWorkflow {
  _id: string;
  name: string;
  botId: string;
  steps: string[];
  event: string;
  values: Array<Record<string, any>>;
  enabled: boolean;
}

export const workflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true },
    botId: { type: String, required: true },
    steps: { type: [String], required: true },
    values: { type: Schema.Types.Mixed, required: true },
    event: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

export const WorkflowModel = model<IWorkflow>('workflows', workflowSchema);
