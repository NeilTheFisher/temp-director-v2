import { eventContract } from "./event";
import { healthContract } from "./health";
import { messageContract } from "./live/message";
import { oauthContract } from "./oauth";
import { odienceContract } from "./odience";
import { streamContract } from "./stream";
import { userContract } from "./user";
import { webContract } from "./web";

export const appContract = {
  messages: messageContract,
  health: healthContract,
  events: eventContract,
  odience: odienceContract,
  stream: streamContract,
  user: userContract,
  web: webContract,
  oauth: oauthContract,
};
