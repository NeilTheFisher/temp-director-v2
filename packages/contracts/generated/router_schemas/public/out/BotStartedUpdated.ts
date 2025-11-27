import { z } from "zod";

export const BotStartedUpdated = z
  .object({
    value: z
      .boolean()
      .describe(
        "Whether the bot action has started or stopped (e.g., poll started, contest started)",
      ),
    bot_id: z.string().describe("The bot id that was updated"),
    type: z.string().describe("The bot's type").optional(),
  })
  .describe(
    "Event when an action on a bot is started or stopped (generic bot update)",
  );
export type BotStartedUpdated = z.infer<typeof BotStartedUpdated>;
