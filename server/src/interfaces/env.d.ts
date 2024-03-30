declare global {
	namespace NodeJS {
		interface ProcessENV {
			PORT: number
			POSTGRES_DB: string
			POSTGRES_USERNAME: string
			POSTGRES_PASSWORD: string
			POSTGRES_HOST: string
			POSTGRES_PORT: number
			SECRET_KEY: string
			DOCKER_ORIGIN_URL: string
		}
	}
}

export {}
