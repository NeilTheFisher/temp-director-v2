import { z } from "zod";

export const QuestionApprove = z.object({ questionId: z.string() });
export type QuestionApprove = z.infer<typeof QuestionApprove>;
