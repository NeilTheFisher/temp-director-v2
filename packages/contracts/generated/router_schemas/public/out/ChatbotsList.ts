import { z } from "zod";

export const ChatbotsList = z
  .object({
    eventId: z.string().describe("Event ID"),
    list: z.array(
      z.record(z.string(), z.any()).and(
        z
          .object({
            id: z.string().describe("Chatbot ID"),
            action_image_url: z
              .string()
              .describe("Chatbot Image Url")
              .optional(),
            name: z.string().describe("Chatbot Name").optional(),
            display_name: z
              .string()
              .describe("Chatbot Display Name")
              .optional(),
            bot_id: z.string().describe("Chatbot sip ID"),
            type: z.string().describe("Chatbot Type").optional(),
            payload: z.string().describe("Chatbot Payload").optional(),
            chat_theme: z
              .record(z.string(), z.any())
              .describe("Chatbot Chat Theme")
              .optional(),
            rich_card_theme: z
              .record(z.string(), z.any())
              .describe("Richcard Theme")
              .optional(),
            started: z
              .boolean()
              .describe("If this chatbot has been started")
              .optional(),
            results_displayed: z
              .object({
                value: z
                  .boolean()
                  .describe("If chatbot results are displayed or not"),
                expanded: z
                  .boolean()
                  .describe("If the chatbot results are expanded or not")
                  .optional(),
              })
              .describe("If this chatbot's results have been displayed")
              .optional(),
            chatbot_image_alignment: z
              .string()
              .describe("Chatbot image alignment")
              .optional(),
            chatbot_image_style: z
              .string()
              .describe("Chatbot image style")
              .optional(),
            chatbot_blurred_background: z
              .boolean()
              .describe("Chatbot blurred background")
              .optional(),
            user_seen: z
              .boolean()
              .describe("If user has seen the chatbot")
              .optional(),
          })
          .describe("Stream"),
      ),
    ),
  })
  .describe("Event sent to share the list of all chatbots");
export type ChatbotsList = z.infer<typeof ChatbotsList>;
