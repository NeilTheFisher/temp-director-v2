import type { RouterClient } from "@orpc/server";
import { pub } from "../orpc";
import { eventRouter } from "./event";
import { healthRouter } from "./health";
import { odienceRouter } from "./odience";
import { streamRouter } from "./stream";
import { userRouter } from "./user";
import { webRouter } from "./web";

export const appRouter = pub.router({
  messages: {} as any, // TODO
  health: healthRouter,
  events: eventRouter,
  odience: odienceRouter,
  stream: streamRouter,
  user: userRouter,
  web: webRouter,
});

export type AppRouterClient = RouterClient<typeof appRouter>;
