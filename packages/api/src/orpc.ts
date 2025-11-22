import { base } from "./middlewares/1_base";
import { authMiddleware } from "./middlewares/auth";
import { errorMiddleware } from "./middlewares/error";

export const pub = base.use(errorMiddleware);

export const authed = pub.use(authMiddleware);
