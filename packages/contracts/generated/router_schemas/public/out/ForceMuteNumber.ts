import { z } from "zod";

export const ForceMuteNumber = z
  .object({
    value: z.boolean().describe("If user is muted or not"),
    deviceSip: z
      .string()
      .describe("sip of the device that user is on call with"),
  })
  .describe(
    "Event sent to the wall when moderator moderator mutes the user on wall",
  );
export type ForceMuteNumber = z.infer<typeof ForceMuteNumber>;
