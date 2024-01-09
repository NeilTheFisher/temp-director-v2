import * as dotenv from 'dotenv'
import { DirectorApi } from './server'

// Load environment variables from .env file
dotenv.config()

// const LISTEN_PORT = Number(process.env.HTTP_PORT) ?? 3000;
const LISTEN_PORT = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000

const directorApiServer = new DirectorApi()
directorApiServer.startServer(LISTEN_PORT)
