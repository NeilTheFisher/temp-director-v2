import { z } from "zod";

export const QuestionDisplayed = z
  .any()
  .describe("Question")
  .describe(
    "Event sent to everybody (Moderators and Users) when a question has been displayed",
  );
export type QuestionDisplayed = z.infer<typeof QuestionDisplayed>;
