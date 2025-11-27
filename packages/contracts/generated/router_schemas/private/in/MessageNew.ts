import { z } from "zod";

export const MessageNew = z.object({ content: z.string() });
export type MessageNew = z.infer<typeof MessageNew>;
