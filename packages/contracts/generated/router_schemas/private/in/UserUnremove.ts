import { z } from "zod";

export const UserUnremove = z.object({ userId: z.string() });
export type UserUnremove = z.infer<typeof UserUnremove>;
