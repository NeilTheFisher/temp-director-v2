import { z } from "zod";

export const UserPreviewFrame = z.object({ content: z.string() });
export type UserPreviewFrame = z.infer<typeof UserPreviewFrame>;
