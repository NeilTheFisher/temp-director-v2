import { z } from "zod";

export const QuestionAnswered = z
  .any()
  .describe("Question")
  .describe(
    "Event sent to everybody (Moderators and Users) when a question has been answeredr",
  );
export type QuestionAnswered = z.infer<typeof QuestionAnswered>;
