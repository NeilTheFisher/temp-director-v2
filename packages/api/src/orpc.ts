import { authMiddleware } from "./middlewares/auth";
import { base } from "./middlewares/base";
import { errorMiddleware } from "./middlewares/error";

export const pub = base.use(errorMiddleware);

export const authed = pub.use(authMiddleware);
