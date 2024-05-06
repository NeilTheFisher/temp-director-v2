import cors from "cors"
import express from "express"
import * as Sentry from "@sentry/node"
import session from "express-session"
import isoCountries from "i18n-iso-countries"
import passport from "passport"
import { routes as apiRoutes } from "./routes/index"
// import https from 'https'
// import fs from 'fs'

export class DirectorApi {
  private server: any

  constructor() {
    console.log("init directorapi rest api")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"))
  }

  public startServer(port = 3000) {
    const app = express()

    Sentry.init({
      dsn: "https://0e04ee19d93852508924c8b576c80978@sentry.erl.rcs.st/2",
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
    })
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler())
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler())
    // The error handler must be registered before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler())

    app.use(
      session({
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cors())
    app.use("", apiRoutes)
    this.server = app.listen(port, "0.0.0.0")
    console.log(`HTTP Server is running on port ${port}`)
  }

  public async close() {
    await this.server.close()
  }
}
