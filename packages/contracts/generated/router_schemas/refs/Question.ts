import { z } from "zod";

export const Question = z
  .object({
    id: z.string().describe("Question Id"),
    creationTimestamp: z.number().int().gte(0).describe("Question creation timestamp"),
    type: z.enum(["text", "video"]).describe("Question type"),
    sender: z.record(z.string(), z.any()).describe("User who sent the question"),
    content: z.string().describe("Question content"),
    status: z.string().describe("Question status"),
    isAnswered: z.boolean().describe("Question is answered"),
    beenDisplayed: z.boolean().describe("Question has been displayed"),
    displayed: z.boolean().describe("Question is being displayed"),
    pinned: z.boolean().describe("Question has been pinned"),
  })
  .describe("Question");
export type Question = z.infer<typeof Question>;
