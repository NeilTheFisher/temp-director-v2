import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { RequestManager } from './controller/requestManager'
import { DbManager } from './utils/dbmanager'
import { Settings } from './utils/Settings'
import isoCountries from 'i18n-iso-countries'
// import https from 'https'
// import fs from 'fs'

const ROUTE_PATH_PROVISIONING = '/odience'
const ROUTE_PATH_GETEVENTSLIST = '/api/getEventsList'
const ROUTE_PATH_GETUSERINFO = '/api/getUserInfo'
export class DirectorApi {
	private dbManager: DbManager
	private settings: Settings
	private requestManager: RequestManager

	constructor() {
		console.log('init directorapi rest api')
		this.dbManager = new DbManager()
		this.settings = new Settings(this.dbManager)
		this.requestManager = new RequestManager(this, this.dbManager)

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		isoCountries.registerLocale(require('i18n-iso-countries/langs/en.json'))
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
			this.requestManager.odience(req, res)
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
			this.requestManager.getEventsList(req, res)
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
			this.requestManager.getUserInfo(req, res)
				.then(() => {
				// Handle success if needed
				})
				.catch((error) => {
				// Handle errors appropriately
					console.error(error)
					res.status(500).send('Internal Server Error')
				})
		})

		app.listen(port, '0.0.0.0', () => {
			console.log(`HTTP Server is running on port ${port}`)
		})

		// const privateKey = fs.readFileSync('priv/private-key.pem', 'utf8')
		// const certificate = fs.readFileSync('priv/certificate.pem', 'utf8')
		// const credentials = { key: privateKey, cert: certificate }
		// const httpsServer = https.createServer(credentials, app)
		// httpsServer.listen(port, () => {
		// 	console.log(`Server is running on port ${port}`)
		// })
	}

	public getSettings() {
		return this.settings
	}
}
