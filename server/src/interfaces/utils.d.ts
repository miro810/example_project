import type { Request } from 'express'
import type { Model, ModelStatic } from 'sequelize'

export type MyStaticModel<T extends {}> = ModelStatic<Model<T, {}>>
export type MyModel<T extends {}> = Model<T, {}>
export type UserTokenData = {
	id: number
	email: string
	password?: string
	role: string
	img?: string
}

interface IUserRequest extends Request {
	userRawData: UserTokenData
}

export type TRequestBody = Omit<Request, 'body'> & { body: IUserRequest }
