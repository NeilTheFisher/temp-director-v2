import { z } from "zod";

export const CatalogFeedUpdated = z
  .object({ eventId: z.string().describe("event id") })
  .describe("Emitted Event event catalog feed is updated");
export type CatalogFeedUpdated = z.infer<typeof CatalogFeedUpdated>;
