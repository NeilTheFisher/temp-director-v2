import { z } from "zod";

export const ChatbotNotificationDismiss = z
  .object({
    chatbotId: z.string().describe("id of the chatbot being dismissed"),
  })
  .describe("Event when user dismisses a chatbot notification (poll/contest)");
export type ChatbotNotificationDismiss = z.infer<
  typeof ChatbotNotificationDismiss
>;
