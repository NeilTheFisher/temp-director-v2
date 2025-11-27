import { z } from "zod";

export const QuestionNew = z.object({
  content: z.string(),
  type: z.string(),
  status: z.string().optional(),
});
export type QuestionNew = z.infer<typeof QuestionNew>;
