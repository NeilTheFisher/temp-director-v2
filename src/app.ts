import * as Sentry from "@sentry/bun"
import * as dotenv from "dotenv"
import "reflect-metadata"
import { DirectorApi } from "./server"

// Load environment variables from .env file
dotenv.config()

if (process.argv[2] && process.argv[2] === "test") {
  console.log('"test" passed as argument, will close the server in 1 second')
  setTimeout(() => {
    directorApiServer.close()
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
directorApiServer.startServer(LISTEN_PORT)
