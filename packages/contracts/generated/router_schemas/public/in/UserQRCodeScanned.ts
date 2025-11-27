import { z } from "zod";

export const UserQRCodeScanned = z
  .any()
  .describe("Event when user scans a qr code");
export type UserQRCodeScanned = z.infer<typeof UserQRCodeScanned>;
