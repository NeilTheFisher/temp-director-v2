import { z } from "zod";

export const FrontRowCheckNFT = z
  .object({
    userId: z.string().describe("user id to send the action to"),
    media_url: z.string().describe("public media url"),
  })
  .describe("Event to check for nft setting");
export type FrontRowCheckNFT = z.infer<typeof FrontRowCheckNFT>;
