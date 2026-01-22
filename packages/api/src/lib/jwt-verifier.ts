import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import jwt from "jsonwebtoken";

let publicKey: string | null = null;

function getPublicKey(): string {
  if (!publicKey) {
    const keyPath = path.join(
      fileURLToPath(new URL(import.meta.url)),
      "../../../../../",
      "priv",
      "public.key"
    );
    publicKey = fs.readFileSync(keyPath, "utf8");
  }
  return publicKey;
}

/**
 * Verify a JWT token from an Authorization header and extract the user ID.
 * Expected format: "Bearer <token>"
 *
 * @param authHeader The Authorization header value
 * @returns The user ID from the token's 'sub' claim, or null if verification fails
 */
export async function verifyJWTToken(authHeader: string): Promise<string | null> {
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("Invalid authorization header format");
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("No token found in authorization header");
      return null;
    }

    const publicKey = getPublicKey();

    const { resolve, promise } = Promise.withResolvers<string | jwt.JwtPayload | undefined>();
    jwt.verify(
      token,
      publicKey,
      {
        algorithms: ["RS256"],
        clockTolerance: 250,
      },
      (errors, decoded) => {
        if (errors) {
          console.error("JWT verification error", errors);
          resolve(undefined);
          return;
        }
        resolve(decoded);
      }
    );
    const decodedToken = await promise;

    if (!decodedToken) {
      return null;
    }
    if (typeof decodedToken === "string") {
      console.warn("Decoded token is a string, expected object");
      return null;
    }

    const userId = decodedToken?.sub;
    if (!userId) {
      console.warn("No 'sub' claim found in JWT token");
      return null;
    }

    return userId;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("verifyJWTToken error:", (error as jwt.JsonWebTokenError).message);
    } else {
      console.error("Unexpected error during JWT verification:", error);
    }
    return null;
  }
}
