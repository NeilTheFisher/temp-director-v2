import { z } from "zod";

export const QuestionApproved = z
  .any()
  .describe("Question")
  .describe("Event sent to everybody (Moderators and Users) when a question has been approved");
export type QuestionApproved = z.infer<typeof QuestionApproved>;
