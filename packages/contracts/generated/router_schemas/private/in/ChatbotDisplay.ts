import { z } from "zod";

export const ChatbotDisplay = z
  .object({
    value: z.boolean().describe("If chatbot results are displayed or not"),
    expanded: z
      .boolean()
      .describe("if the chatbot results are expanded or not")
      .optional(),
    bot_id: z
      .number()
      .describe("The non-sip bot ID to identify which chatbot to display")
      .optional(),
    action: z.string().describe("Which action should be displayed").optional(),
  })
  .describe(
    "Event when presenter wants to display or hide chatbot results on video wall",
  );
export type ChatbotDisplay = z.infer<typeof ChatbotDisplay>;
