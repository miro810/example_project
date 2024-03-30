import type { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../error/ApiError'
import type { TRequestBody, UserTokenData } from '../interfaces/utils'

export default function (roles: Array<string>) {
	return function (req: TRequestBody, res: Response, next: NextFunction): ApiError | void {
		const secret: string = process.env.SECRET_KEY as string
		if (req.method === 'OPTIONS') next()

		try {
			const token: string | undefined = req.headers.authorization
			if (!token) return next(ApiError.Unauthorized())

			const existToken: string = token.split(' ')[1] as string
			const decodedToken: UserTokenData = jwt.verify(existToken, secret) as UserTokenData
			if (!roles.includes(decodedToken.role)) return next(ApiError.Forbidden("User don't have access"))

			req.body.userRawData = decodedToken
			next()
		} catch (e) {
			return next(ApiError.Unauthorized())
		}
	}
}
