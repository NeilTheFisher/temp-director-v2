import { z } from "zod";

export const PropublisherUpdated = z
  .object({
    uid: z.string().describe("Propublisher uid"),
    eventIds: z.array(z.any()).describe("Propublisher affected events"),
    status: z.string().describe("if stream was created or deleted"),
  })
  .describe("Event probublisher had updates");
export type PropublisherUpdated = z.infer<typeof PropublisherUpdated>;
