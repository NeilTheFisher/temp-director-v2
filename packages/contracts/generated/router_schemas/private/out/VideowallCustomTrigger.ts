import { z } from "zod";

export const VideowallCustomTrigger = z
  .object({
    id: z.string().describe("trigger id"),
    name: z.string().describe("trigger name"),
    wallId: z.string().describe("wall id associated to trigger"),
  })
  .describe("Event when we want to trigger a custom videowall event from template");
export type VideowallCustomTrigger = z.infer<typeof VideowallCustomTrigger>;
