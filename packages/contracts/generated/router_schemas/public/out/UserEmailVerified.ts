import { z } from "zod";

export const UserEmailVerified = z
  .object({
    userId: z.string().describe("user msisdn"),
    email: z.string().describe("Email that has been verified"),
  })
  .describe("Event when user's email has been verified");
export type UserEmailVerified = z.infer<typeof UserEmailVerified>;
