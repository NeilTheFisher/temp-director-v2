import * as Sentry from "@sentry/bun"
import * as dotenv from "dotenv"
import "reflect-metadata"
import { DirectorApi } from "./server"
import RedisService from "./services/RedisService"
import { AppDataSource } from "./data-source"

// Load env vars
dotenv.config()

const redisService = RedisService.getInstance()
const redisClient = redisService.getClient()
const LISTEN_PORT = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000
const directorApiServer = new DirectorApi()

// Sentry
Sentry.init({
  dsn: "https://4c1088a02529302c3c6b4d3a010dfb0b@sentry.erl.rcs.st/12",
  tracesSampleRate: 1.0,
})

// Redis connection events
redisClient.on("error", (err: any) => {
  console.error("Redis error:", err)
})

redisClient.on("end", () => {
  console.error("Redis connection closed. Exiting...")
  directorApiServer.close()
  process.exit(1)
})

// ✅ TEST MODE: skips full startup
if (process.argv.includes("test")) {
  console.log("\"test\" passed as argument. Skipping service init...")
  setTimeout(() => {
    directorApiServer.close()
    redisService.disconnect()
    process.exit(0)
  }, 1000)
} else {
  // ✅ Full startup
  AppDataSource.initialize()
    .then(async () => {
      console.log("MySQL Data Source initialized!")

      // Optional: Run a quick test query
      await AppDataSource.query("SELECT 1")
      console.log("MySQL connection test succeeded!")

      await redisClient.connect()
      console.log("Redis client connected. Starting the server...")

      directorApiServer.startServer(LISTEN_PORT)
    })
    .catch((err: any) => {
      console.error("Failed to start services. Exiting...")
      console.error(err)
      process.exit(1)
    })
}

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down...")
  await redisService.disconnect()
  directorApiServer.close()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down...")
  await redisService.disconnect()
  directorApiServer.close()
  process.exit(0)
})
