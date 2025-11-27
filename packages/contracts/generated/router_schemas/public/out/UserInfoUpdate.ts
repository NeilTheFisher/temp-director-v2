import { z } from "zod";

export const UserInfoUpdate = z
  .any()
  .describe("User")
  .describe("Event sent when a user have been updated");
export type UserInfoUpdate = z.infer<typeof UserInfoUpdate>;
