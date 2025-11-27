import { z } from "zod";

export const ShowEventEndTimer = z.object({
  duration: z.number().int().optional(),
  cancel: z.boolean().optional(),
});
export type ShowEventEndTimer = z.infer<typeof ShowEventEndTimer>;
