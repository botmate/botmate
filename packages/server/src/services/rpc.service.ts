import { z } from 'zod';

import { Application } from '../application';
import { publicProcedure } from './_trpc';

export class RPCService {
  constructor(private app: Application) {}

  getRoutes() {
    return {
      invokePluginRPCQuery: publicProcedure
        .input(
          z.object({
            name: z.string(),
            params: z.any(),
            botId: z.string(),
            pluginName: z.string(),
          }),
        )
        .query(async ({ input: { name, botId, pluginName, params } }) => {
          const rpc = this.app.botManager.bots
            .get(botId)
            ?.plugins.get(pluginName)?.rpc as any;
          if (rpc) {
            if (rpc[name]) {
              try {
                return rpc[name](params);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }),
      invokePluginRPCMutation: publicProcedure
        .input(
          z.object({
            name: z.string(),
            params: z.any(),
            botId: z.string(),
            pluginName: z.string(),
          }),
        )
        .mutation(async ({ input: { name, botId, pluginName, params } }) => {
          const rpc = this.app.botManager.bots
            .get(botId)
            ?.plugins.get(pluginName)?.rpc as any;
          if (rpc) {
            if (rpc[name]) {
              try {
                return rpc[name](params);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }),
    };
  }
}
