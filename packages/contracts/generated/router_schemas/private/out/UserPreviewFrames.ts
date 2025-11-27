import { z } from "zod";

export const UserPreviewFrames = z.object({
  list: z.array(
    z.record(z.string(), z.any()).and(
      z.object({
        image: z.boolean(),
        userId: z.string(),
        buffer: z.string(),
      }),
    ),
  ),
});
export type UserPreviewFrames = z.infer<typeof UserPreviewFrames>;
