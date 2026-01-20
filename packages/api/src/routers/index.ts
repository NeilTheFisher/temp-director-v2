import type { RouterClient } from "@orpc/server";
import { pub } from "../orpc";
import { eventRouter } from "./event";
import { healthRouter } from "./health";
import { messageRouter } from "./live/messages";
import { odienceRouter } from "./odience";
import { streamRouter } from "./stream";
import { userRouter } from "./user";
import { webRouter } from "./web";

export const appRouter = pub.router({
  messages: messageRouter,
  health: healthRouter,
  events: eventRouter,
  odience: odienceRouter,
  stream: streamRouter,
  user: userRouter,
  web: webRouter,
});

export type AppRouterClient = RouterClient<typeof appRouter>;
