import { eventContract } from "./event";
import { healthContract } from "./health";
import { odienceContract } from "./odience";
import { streamContract } from "./stream";
import { userContract } from "./user";

export const appContract = {
  health: healthContract,
  events: eventContract,
  odience: odienceContract,
  stream: streamContract,
  user: userContract,
};
