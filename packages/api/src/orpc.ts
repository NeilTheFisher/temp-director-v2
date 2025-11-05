import { authMiddleware } from "./middlewares/auth";

import { pub } from "./middlewares/pub";

export { pub };

export const authed = pub.use(authMiddleware);
