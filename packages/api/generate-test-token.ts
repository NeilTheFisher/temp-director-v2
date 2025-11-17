import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKey = fs.readFileSync(
  path.join(__dirname, "../../priv/private-key.pem"),
  "utf8",
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../../priv/public.key"),
  "utf8",
);

// user id 1
const token = jwt.sign({ sub: "1" }, privateKey, {
  algorithm: "RS256",
  expiresIn: "1h",
});

console.log("Generated Token:");
console.log("Authorization: Bearer " + token);
console.log("\n--- Verifying Token ---");

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
