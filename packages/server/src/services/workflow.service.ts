import { z } from 'zod';

import { Application } from '../application';
import { IWorkflow, WorkflowModel } from '../models/workflows.model';
import { publicProcedure } from './_trpc';

export class WorkflowService {
  constructor(private app: Application) {}

  createWorkflow(data: Partial<IWorkflow>) {
    return WorkflowModel.create(data);
  }

  async listWorkflows(botId: string) {
    const data = await WorkflowModel.find({ botId }).sort({ createdAt: -1 });
    return data.map((d) => d.toJSON());
  }

  getRoutes() {
    return {
      createWorkflow: publicProcedure
        .input(
          z.object({
            _id: z.string().optional(),
            event: z.string(),
            name: z.string(),
            botId: z.string(),
            steps: z.array(z.string()),
            values: z.array(z.record(z.any())),
            enabled: z.boolean(),
          }),
        )
        .mutation(async ({ input }) => {
          const workflow = await this.createWorkflow(input);
          const bot = this.app.botManager.bots.get(input.botId);
          bot?.workflows?.set(workflow._id, {
            botId: input.botId,
            event: input.event,
            steps: input.steps,
            values: input.values,
          });
          return workflow.toJSON();
        }),

      listWorkflows: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
          const workflows = await this.listWorkflows(input);
          return workflows;
        }),

      updateWorkflow: publicProcedure
        .input(
          z.object({
            _id: z.string(),
            event: z.string(),
            name: z.string(),
            botId: z.string(),
            steps: z.array(z.string()),
            values: z.array(z.record(z.any())),
            enabled: z.boolean(),
          }),
        )
        .mutation(async ({ input }) => {
          const workflow = await WorkflowModel.findByIdAndUpdate(
            input._id,
            input,
            { new: true },
          );
          const bot = this.app.botManager.bots.get(input.botId);
          bot?.workflows?.set(input._id, {
            botId: input.botId,
            event: input.event,
            steps: input.steps,
            values: input.values,
          });
          return workflow?.toObject();
        }),

      deleteWorkflow: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
          const wf = await WorkflowModel.findByIdAndDelete(input);
          if (!wf) return null;
          const bot = this.app.botManager.bots.get(wf.botId);
          bot?.workflows?.delete(input);
          return null;
        }),

      getWorkflowEvents: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
          const events = await this.app.workflowManager.getEvents(input);
          return events;
        }),
      getWorkflowActions: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
          const actions = await this.app.workflowManager.getActions(input);
          return actions;
        }),
    };
  }
}
