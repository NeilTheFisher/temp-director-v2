import z from "zod";

import { MessageNew as MessageNewPublicIn } from "../../../generated/router_schemas/public/in";
import { MessagesList } from "../../../generated/router_schemas/public/out";
import { Message } from "../../../generated/router_schemas/refs";
import { base } from "../base";

/**
 * Message Contract for Live Events
 *
 * This contract proxies socket events from the router project.
 *
 * Flow:
 * 1. User sends `sendMessage` with { content: string } (PUBLIC IN: MessageNew)
 * 2. Server acknowledges with MessagePending (PUBLIC OUT)
 * 3. Server sends to moderators (PRIVATE OUT: MessageNew)
 * 4. After moderation, MessagePublished broadcast (PUBLIC OUT)
 */
export const messageContract = base.router({
  /**
   * PUBLIC IN: MessageNew
   * Send a new message to the event chat.
   * Returns the pending message acknowledgment.
   */
  sendMessage: base.input(MessageNewPublicIn).output(Message),

  /**
   * Get list of messages for the current event.
   * PUBLIC OUT: MessagesList
   */
  listMessages: base.input(z.void()).output(MessagesList),
});
