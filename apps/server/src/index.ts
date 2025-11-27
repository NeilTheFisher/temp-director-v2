import { env } from "@director_v2/config";

if (env.ENV === "production") {
  await import("./cluster");
} else {
  await import("./server");
}
