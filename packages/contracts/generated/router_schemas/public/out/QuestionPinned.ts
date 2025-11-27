import { z } from "zod";

export const QuestionPinned = z
  .any()
  .describe("Question")
  .describe(
    "Event sent to everybody (Moderators and Users) when a question has been pinned",
  );
export type QuestionPinned = z.infer<typeof QuestionPinned>;
