import { z } from "zod";

export const Notification = z
  .object({
    title: z.string().describe("The title of a notification"),
    text: z.string().describe("The text of a notification"),
  })
  .describe("Eventwhen any notification is sent to a user");
export type Notification = z.infer<typeof Notification>;
