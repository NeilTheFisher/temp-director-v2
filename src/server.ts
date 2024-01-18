import cors from 'cors'
import express from 'express'
import session from 'express-session'
import isoCountries from 'i18n-iso-countries'
import passport from 'passport'
import { RequestManager } from './controller/requestManager'
import { Settings } from './utils/Settings'
import { DbManager } from './utils/dbmanager'
// import https from 'https'
// import fs from 'fs'

const ROUTE_PATH_PROVISIONING = '/odience'
const ROUTE_PATH_GETEVENTSLIST = '/api/getEventsList'
const ROUTE_PATH_GETUSERINFO = '/api/getUserInfo'
export class DirectorApi {
	private dbManager: DbManager
	private settings: Settings
	private requestManager: RequestManager
	private server: any

	constructor(dbConnection: any | undefined = undefined) {
		console.log('init directorapi rest api')
		this.dbManager = new DbManager()
		this.dbManager.connect(dbConnection)
		this.settings = new Settings(this.dbManager)
		this.requestManager = new RequestManager(this, this.dbManager)

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		isoCountries.registerLocale(require('i18n-iso-countries/langs/en.json'))
	}

	public getDbManager() {
		return this.dbManager
	}

	public startServer(port: number = 3000) {
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

		app.get(ROUTE_PATH_PROVISIONING, (req, res) => {
			this.requestManager
				.odience(req, res)
				.then(() => {
					// Handle success if needed
				})
				.catch((error) => {
					// Handle errors appropriately
					console.error(error)
					res.status(500).send('Internal Server Error')
				})
		})
		app.get(ROUTE_PATH_GETEVENTSLIST, (req, res) => {
			this.requestManager
				.getEventsList(req, res)
				.then(() => {
					// Handle success if needed
				})
				.catch((error) => {
					// Handle errors appropriately
					console.error(error)
					res.status(500).send('Internal Server Error')
				})
		})
		app.get(ROUTE_PATH_GETUSERINFO, (req, res) => {
			this.requestManager
				.getUserInfo(req, res)
				.then(() => {
					// Handle success if needed
				})
				.catch((error) => {
					// Handle errors appropriately
					console.error(error)
					res.status(500).send('Internal Server Error')
				})
		})

		this.server = app.listen(port, '0.0.0.0')
		console.log(`HTTP Server is running on port ${port}`)
	}

	public async close() {
		await this.server.close()
	}

	public getSettings() {
		return this.settings
	}
}
