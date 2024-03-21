import cors from "cors"
import express from "express"
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
