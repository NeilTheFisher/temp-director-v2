import { z } from "zod";

export const AccessDenied = z
  .object({ message: z.string().describe("Message") })
  .describe("Event sent back when an user has not permissions to view event");
export type AccessDenied = z.infer<typeof AccessDenied>;
