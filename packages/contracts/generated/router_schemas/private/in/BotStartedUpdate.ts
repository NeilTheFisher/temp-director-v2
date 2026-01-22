import { z } from "zod";

export const BotStartedUpdate = z
  .object({
    value: z
      .boolean()
      .describe("Whether the bot action has started or not (e.g., poll started, contest started)"),
    bot_id: z.string().describe("Bot id"),
  })
  .describe("Event when presenter starts or ends an action on a bot (generic bot update)");
export type BotStartedUpdate = z.infer<typeof BotStartedUpdate>;
