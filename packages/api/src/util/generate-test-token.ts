import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import jwt from "jsonwebtoken";

export function generateTestToken(userId = "1", verify = false) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const keyDir = path.join(__dirname, "../../../../priv");
  const privateKey = fs.readFileSync(path.join(keyDir, "private-key.pem"));
  const publicKey = fs.readFileSync(path.join(keyDir, "public.key"));

  const token = jwt.sign({ sub: userId }, privateKey, {
    algorithm: "RS256",
    expiresIn: "10years",
  });

  if (verify) {
    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        clockTolerance: 250,
      });
      console.log("✓ Verification successful!");
      console.log("Decoded payload:", decoded);
    } catch (error) {
      console.error("✗ Verification failed:", error);
      console.error("Full error:", error);
    }
  }

  return token;
}
