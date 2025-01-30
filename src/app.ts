import * as Sentry from "@sentry/bun"
import * as dotenv from "dotenv"
import "reflect-metadata"
import { DirectorApi } from "./server"
import RedisService from "./services/RedisService"

// Load environment variables from .env file
dotenv.config()

// Initialize Redis Service as a singleton
const redisService = RedisService.getInstance();

if (process.argv[2] && process.argv[2] === "test") {
  console.log('"test" passed as argument, will close the server in 1 second')
  setTimeout(() => {
    directorApiServer.close()
    redisService.disconnect();
    process.exit(0)
  }, 1000)
}

// const LISTEN_PORT = Number(process.env.HTTP_PORT) ?? 3000;
const LISTEN_PORT = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000

const directorApiServer = new DirectorApi()
Sentry.init({
  dsn: "https://4c1088a02529302c3c6b4d3a010dfb0b@sentry.erl.rcs.st/12",
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
})
// Ensure Redis is ready before starting the server
redisService
  .getClient()
  .connect()
  .then(() => {
    console.log("Redis client connected. Starting the server...");
    directorApiServer.startServer(LISTEN_PORT);
  })
  .catch((err:any) => {
    console.error("Failed to connect to Redis. Exiting...");
    console.error(err);
    process.exit(1); // Exit if Redis connection fails
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down...");
  await redisService.disconnect(); // Disconnect Redis client
  directorApiServer.close(); // Close the API server
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down...");
  await redisService.disconnect(); // Disconnect Redis client
  directorApiServer.close(); // Close the API server
  process.exit(0);
});
