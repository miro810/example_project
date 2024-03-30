import type { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'

export default function (error: object, req: Request, res: Response, ignore: NextFunction): Response {
	if (error instanceof ApiError) return res.status(error.status).json({ message: error.message })

	return res.status(500).json({ message: 'Unknown Error! ([Line 7]: ErrorMiddleware.ts)' })
}
