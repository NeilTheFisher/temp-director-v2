import { z } from "zod";

export const UserPreviewFrame = z.object({
  image: z.boolean(),
  userId: z.string(),
  buffer: z.string(),
});
export type UserPreviewFrame = z.infer<typeof UserPreviewFrame>;
