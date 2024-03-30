import type { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../error/ApiError'
import { TRequestBody } from '../interfaces/utils'

export default function (req: TRequestBody, res: Response, next: NextFunction): ApiError | void {
	const secret: string = process.env.SECRET_KEY as string
	if (req.method === 'OPTIONS') next()

	try {
		const token: string | undefined = req.headers.authorization
		if (!token) return next(ApiError.Unauthorized())

		const existToken: string = token.split(' ')[1] as string
		req.body.userRawData = jwt.verify(existToken, secret) as any
		next()
	} catch (e) {
		return next(ApiError.Unauthorized())
	}
}
