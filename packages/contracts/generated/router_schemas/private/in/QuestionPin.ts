import { z } from "zod";

export const QuestionPin = z.object({
  questionId: z.string(),
  value: z.boolean(),
});
export type QuestionPin = z.infer<typeof QuestionPin>;
