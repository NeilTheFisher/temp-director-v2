import { z } from "zod";

export const QuestionPublished = z
  .any()
  .describe("Question")
  .describe("Event sent to everybody (Moderators and Users) when a question has been posted");
export type QuestionPublished = z.infer<typeof QuestionPublished>;
