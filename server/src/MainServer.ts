import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import { config } from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'
import ErrorHandlingMiddleware from './middleware/ErrorMiddleware'
import mainRouter from './routes/MainRouter'

config({
	path: path.resolve(fileURLToPath(import.meta.url), '..', '..', `.env.${process.env.NODE_ENV}`),
})

export default class MainServer {
	public expressInstance: express.Express
	public port: string | number = 7000

	constructor() {
		this.expressInstance = express()
		this.middlewareSetup()
		this.customSetup()
	}

	public set portSet(port: string | number) {
		this.port = port
	}

	private middlewareSetup(): void {
		const corsOptions: CorsOptions = {
			// Access-Control-Allow-Credentials
			credentials: true,
			// Access-Control-Allow-Origin
			origin: [
				'http://localhost:8000',
				'http://127.0.0.1:8000',
				'http://192.168.0.100:8000',
				process.env.DOCKER_ORIGIN_URL as string,
			],
		}

		this.expressInstance.use(cors(corsOptions))
		this.expressInstance.use(compression())
		this.expressInstance.use(express.json())
		this.expressInstance.use(express.static(path.resolve('dist/static')))
		this.expressInstance.use(fileUpload({}))
	}

	private customSetup(): void {
		const router: express.Router = new mainRouter().initialRouter

		this.expressInstance.use('/', router)
		this.expressInstance.use(ErrorHandlingMiddleware)
	}

	public async runServer(): Promise<void> {
		try {
			this.expressInstance.listen(this.port, () => {
				console.log(`MainServer: Success ${new Date().toLocaleTimeString([], { hour12: true })}`)
				console.log(`Port: ${this.port}`)
			})
		} catch (e) {
			console.log('MainServer: Error: ', e)
		}
	}
}
