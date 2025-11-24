import { env } from "@director_v2/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    preloadEntriesOnStart: true,
  },
  reactCompiler: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  env: env,
};

export default nextConfig;
