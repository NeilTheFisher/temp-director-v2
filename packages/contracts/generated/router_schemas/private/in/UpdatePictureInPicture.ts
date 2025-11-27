import { z } from "zod";

export const UpdatePictureInPicture = z
  .object({
    value: z.boolean().describe("If picture in picture mode is on or not"),
    position: z.string().describe("Position of PIP stream"),
    streamId: z.string().describe("PIP stream ID"),
  })
  .describe("Event when moderator turns on/off picture in picture mode");
export type UpdatePictureInPicture = z.infer<typeof UpdatePictureInPicture>;
