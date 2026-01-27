import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { env } from "@director_v2/env/server";

export type KeyConfig =
  | { algorithm: "RS256"; privateKey: Buffer; publicKey: Buffer }
  | { algorithm: "HS256"; secret: string };

function readFileIfExists(p: string) {
  try {
    if (!p) return null;
    const resolved = path.resolve(p);
    if (existsSync(resolved)) return readFileSync(resolved);
    return null;
  } catch {
    return null;
  }
}

/**
 * Load keys from environment:
 * - Recommended: Set OAUTH_JWT_SECRET for HS256 symmetric signing (simplest)
 * - Alternative: Set OAUTH_PRIVATE_KEY / OAUTH_PUBLIC_KEY (raw PEM content) for RS256
 * - File-based: Set OAUTH_PRIVATE_KEY_PATH / OAUTH_PUBLIC_KEY_PATH for RS256
 */
export function loadKeyConfig(): KeyConfig | null {
  // Prefer HS256 with secret (simplest approach)
  const secret = env.OAUTH_JWT_SECRET;
  if (secret) {
    return { algorithm: "HS256", secret };
  }

  // Check if RS256 was explicitly requested
  const algEnv = env.OAUTH_JWT_ALG;

  if (algEnv === "HS256") {
    console.warn("HS256 selected but OAUTH_JWT_SECRET is not set");
    return null;
  }

  // RS256 path: check inline env values first
  const privInline = env.OAUTH_PRIVATE_KEY;
  const pubInline = env.OAUTH_PUBLIC_KEY;

  if (privInline && pubInline) {
    return {
      algorithm: "RS256",
      privateKey: Buffer.from(privInline),
      publicKey: Buffer.from(pubInline),
    };
  }

  // else check file paths (only if explicitly provided)
  const privPath = env.OAUTH_PRIVATE_KEY_PATH;
  const pubPath = env.OAUTH_PUBLIC_KEY_PATH;

  if (privPath && pubPath) {
    const privateKey = readFileIfExists(privPath);
    const publicKey = readFileIfExists(pubPath);

    if (privateKey && publicKey) {
      return { algorithm: "RS256", privateKey, publicKey };
    }
  }

  console.warn(
    "No OAuth configuration found. Set OAUTH_JWT_SECRET for HS256 (recommended) " +
      "or OAUTH_PRIVATE_KEY/OAUTH_PUBLIC_KEY for RS256."
  );
  return null;
}
