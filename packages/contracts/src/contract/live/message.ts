import z from "zod";
import { MessageNew } from "../../../generated/router_schemas/public/in/MessageNew";
import { base } from "../base";

export const messageContract = base.prefix("/messages").router({
  listMessages: base
    .route({
      method: "GET",
    })
    .input(MessageNew)
    .output(z.unknown()),
});
