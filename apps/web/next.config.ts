import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    preloadEntriesOnStart: true,
  },
  reactCompiler: true,
};

export default nextConfig;
