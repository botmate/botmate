import { z } from 'zod';

export const createCommandSchema = z.object({
  name: z.string(),
  command: z.string(),
  alias: z.string().optional(),
  description: z.string().optional(),
  // todo: add condition and actions types
  condition: z.any(),
  actions: z.array(z.any()),
});
