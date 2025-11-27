import { z } from "zod";

export const QuestionDeleted = z
  .any()
  .describe("Question")
  .describe(
    "Event sent to everybody (Moderators and Users) when a question has been deleted",
  );
export type QuestionDeleted = z.infer<typeof QuestionDeleted>;
