import { z } from "zod";

export const ForceMuteDevice = z
  .object({
    value: z.boolean().describe("If user is muted or not"),
    deviceSip: z
      .string()
      .describe("sip of the device that user is on call with"),
    streamAudio: z.boolean().describe("If user turns on/off stream audio"),
  })
  .describe("Event when moderator moderator mutes the user on wall");
export type ForceMuteDevice = z.infer<typeof ForceMuteDevice>;
