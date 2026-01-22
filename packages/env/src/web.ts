import { createEnv } from "@t3-oss/env-core";

import { loadEnv } from "./load-env";

export const env = createEnv({
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    // Add client-side env vars here if needed
  },
  runtimeEnv: loadEnv(),
});
