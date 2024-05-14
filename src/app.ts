import * as dotenv from "dotenv"
import "reflect-metadata"
import { DirectorApi } from "./server"
import * as Sentry from "@sentry/bun"

// Load environment variables from .env file
dotenv.config()

// const LISTEN_PORT = Number(process.env.HTTP_PORT) ?? 3000;
const LISTEN_PORT = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000

const directorApiServer = new DirectorApi()
Sentry.init({
  dsn: "https://4c1088a02529302c3c6b4d3a010dfb0b@sentry.erl.rcs.st/12",
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
})
directorApiServer.startServer(LISTEN_PORT)
