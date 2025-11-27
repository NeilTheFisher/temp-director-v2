import { z } from "zod";

export const QuestionRevert = z.object({ questionId: z.string() });
export type QuestionRevert = z.infer<typeof QuestionRevert>;
