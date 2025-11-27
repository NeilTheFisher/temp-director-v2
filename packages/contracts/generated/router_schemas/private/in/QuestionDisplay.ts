import { z } from "zod";

export const QuestionDisplay = z.object({
  questionId: z.string(),
  value: z.boolean(),
});
export type QuestionDisplay = z.infer<typeof QuestionDisplay>;
