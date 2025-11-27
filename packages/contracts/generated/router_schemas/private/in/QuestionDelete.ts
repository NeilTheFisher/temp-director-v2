import { z } from "zod";

export const QuestionDelete = z.object({ questionId: z.string() });
export type QuestionDelete = z.infer<typeof QuestionDelete>;
