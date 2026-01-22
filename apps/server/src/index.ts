import { env } from "@director_v2/env/server";

if (env.ENV === "production") {
  await import("./cluster");
} else {
  await import("./server");
}
