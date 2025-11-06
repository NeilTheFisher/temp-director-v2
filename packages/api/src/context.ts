import { auth } from "@director_v2/auth";
import type { NextRequest } from "next/server";
import { verifyJWTToken } from "./lib/jwt-verifier";

export async function createContext(req: NextRequest) {
  let session: { user: { id: string } } | null = null;

  // Try to get session from Better-Auth cookies
  try {
    const authSession = await auth.api.getSession({
      headers: req.headers,
    });
    if (authSession?.user.id) session = { user: { id: authSession.user.id } };
  } catch (error) {
    console.debug("Failed to get session from Better-Auth:", error);
  }

  // Fallback to JWT token verification if no Better-Auth session
  if (!session) {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const userId = await verifyJWTToken(authHeader);
      if (userId && userId !== "false") {
        // Create a minimal session object from JWT
        session = {
          user: {
            id: userId,
          },
        };
      }
    }
  }

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
