import { z } from "zod";

export const UserUnblock = z.object({ userId: z.string() });
export type UserUnblock = z.infer<typeof UserUnblock>;
