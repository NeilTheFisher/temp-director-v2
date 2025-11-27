import { z } from "zod";

export const UpdateAskQuestion = z
  .object({ value: z.boolean().describe("If lask question is active or not") })
  .describe("Event when moderator turns on/off ask question");
export type UpdateAskQuestion = z.infer<typeof UpdateAskQuestion>;
