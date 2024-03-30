import { config } from 'dotenv'
import path from 'path'
import { Sequelize } from 'sequelize'
import { fileURLToPath } from 'url'

config({
	path: path.resolve(fileURLToPath(import.meta.url), '..', '..', `.env.${process.env.NODE_ENV}`),
})

class DbSettings {
	private readonly _databaseName: string
	private readonly _username: string
	private readonly _password: string
	private readonly _host: string
	private readonly _port: number
	public database: Sequelize

	constructor() {
		this._databaseName = String(process.env.POSTGRES_DB)
		this._username = process.env.POSTGRES_USERNAME || 'unknown'
		this._password = process.env.POSTGRES_PASSWORD || 'unknown'
		this._host = process.env.POSTGRES_HOST || 'localhost'
		this._port = Number(process.env.POSTGRES_PORT) || 5432

		this.database = new Sequelize({
			dialect: 'postgres',
			dialectOptions: { encrypt: true },
			database: this._databaseName,
			username: this._username,
			password: this._password,
			host: this._host,
			port: this._port,
		})

		void this.database.authenticate()
		void this.database.sync({ alter: false })
	}
}

const DBInstance: Sequelize = new DbSettings().database

export default DBInstance
