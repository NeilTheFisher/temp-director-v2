import { z } from "zod";

export const QuestionAnswer = z.object({ questionId: z.string() });
export type QuestionAnswer = z.infer<typeof QuestionAnswer>;
