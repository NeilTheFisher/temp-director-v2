import { z } from "zod";

export const UserStatusUpdate = z.object({ onCall: z.boolean() });
export type UserStatusUpdate = z.infer<typeof UserStatusUpdate>;
