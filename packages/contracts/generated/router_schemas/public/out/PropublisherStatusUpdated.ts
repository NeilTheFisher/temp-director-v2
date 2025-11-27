import { z } from "zod";

export const PropublisherStatusUpdated = z
  .object({
    id: z.string().describe("Propublisher id"),
    uid: z.string().describe("Propublisher uid").optional(),
    running: z
      .boolean()
      .describe("if propublisher is running or not")
      .optional(),
  })
  .describe("Event probublisher had status update");
export type PropublisherStatusUpdated = z.infer<
  typeof PropublisherStatusUpdated
>;
