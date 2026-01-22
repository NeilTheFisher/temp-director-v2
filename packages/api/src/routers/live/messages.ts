import { ORPCError } from "@orpc/server";

import { authed, pub } from "../../orpc";

/**
 * Message Router for Live Events
 *
 * Proxies socket events from the router project.
 * When socket.io client is added, this will forward events to the router.
 *
 * TODO: Add socket.io client to connect to router
 * - Socket URL: configured per environment (e.g., ws://router:3000)
 * - Namespace: /{eventId} for public, /{eventId}/private for moderators
 * - Events to emit: MessageNew (from user)
 * - Events to receive: MessagePending, MessagePublished, MessageDeleted
 */
export const messageRouter = pub.messages.router({
  /**
   * Send a new message to the event chat.
   *
   * Flow in router:
   * 1. Validates user status (not blocked, not rate-limited)
   * 2. Creates message with STATUS_PENDING
   * 3. Emits MessagePending back to sender
   * 4. Emits MessageNew to moderators (private namespace)
   * 5. Auto-approves after MESSAGE_VALIDATION_TIMER (1s)
   * 6. Emits MessagePublished to all users
   *
   * @see router/src/app/event/publicFacade.ts messageNew()
   * @see router/src/app/event/message.ts
   */
  sendMessage: authed.messages.sendMessage.handler(async ({ context: _context, input }) => {
    // TODO: Implement socket.io client proxy to router
    // 1. Get event namespace from user's current event (need eventId in context/input)
    // 2. Connect to router socket if not connected
    // 3. Emit "MessageNew" event with { content: input.content }
    // 4. Wait for "MessagePending" response
    // 5. Return the pending message

    throw new ORPCError("NOT_IMPLEMENTED", {
      message:
        "Socket.io client proxy to router not yet implemented. Input received: " +
        JSON.stringify(input),
    });
  }),

  /**
   * Get list of messages for the current event.
   *
   * Flow in router:
   * 1. Retrieves messages from Messages collection
   * 2. Filters by status (usually STATUS_PUBLISHED for users)
   * 3. Applies message limit from event settings
   *
   * @see router/src/app/event/messages.ts emitMessagesList()
   */
  listMessages: authed.messages.listMessages.handler(
    async ({ context: _context, input: _input }) => {
      // TODO: Implement socket.io client proxy to router
      // 1. Get event namespace from user's current event
      // 2. Connect to router socket if not connected
      // 3. Emit "GetMessagesList" event
      // 4. Wait for "MessagesList" response
      // 5. Return the messages list

      throw new ORPCError("NOT_IMPLEMENTED", {
        message: "Socket.io client proxy to router not yet implemented",
      });
    }
  ),
});
