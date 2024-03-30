import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import MainServer from './MainServer'

config({
	path: path.resolve(fileURLToPath(import.meta.url), '..', '..', `.env.${process.env.NODE_ENV}`),
})

let expressInstance: MainServer = new MainServer()

expressInstance.portSet = process.env.PORT as string

void expressInstance.runServer()
