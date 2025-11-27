import { z } from "zod";

export const ChatbotDisplayed = z
  .object({
    value: z.boolean().describe("If chatbot results are displayed or not"),
    expanded: z
      .boolean()
      .describe("if the chatbot results are expanded or not")
      .optional(),
    bot_id: z
      .number()
      .describe("The non-sip bot ID to identify which chatbot")
      .optional(),
    action: z.string().describe("Which action should be displayed").optional(),
  })
  .describe("Event when chatbot results are displayed or hidden on video wall");
export type ChatbotDisplayed = z.infer<typeof ChatbotDisplayed>;
