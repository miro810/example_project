import type { Request, Response } from 'express'
import { NextFunction } from 'express'
import type { Model } from 'sequelize'
import { Device, Rating } from '../SQLmodels/models'
import ApiError from '../error/ApiError'
import type { IDevice, IRating } from '../interfaces/models'

type GetAllResponse = { rows: Model<IRating, {}>[]; count: number } | null
type GetQuery = { UserId: number; DeviceId: number }

class RatingController {
	private static findMiddleValue(array: number[], count: number): number {
		return array.reduce((a: number, b: number): number => a + b, 0) / count
	}

	public async addOrUpdateRating(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		const { rate, UserId, DeviceId } = req.body
		if (rate > 5 || rate < 0) return next(ApiError.BadRequest('Rate is out range of values'))
		if (!UserId || !DeviceId) return next(ApiError.BadRequest('Set UserId and DeviceId req.body'))

		const isRatingExist: Model<IRating, {}> | null = await Rating.findOne({ where: { UserId, DeviceId } })
		if (!isRatingExist) await Rating.create({ rate, UserId, DeviceId })

		//TODO: Best practices - use aggregate functions
		if (isRatingExist) await isRatingExist.update({ rate })
		const dbValues: GetAllResponse = await Rating.findAndCountAll({ where: { DeviceId } })
		const arrayOfValues: number[] = dbValues.rows.map((i: Model<IRating, {}>) => i.dataValues.rate)
		const midValue: number = RatingController.findMiddleValue(arrayOfValues, dbValues.count)

		const isDeviceExist: Model<IDevice, {}> | null = await Device.findOne({
			where: { id: DeviceId },
		})

		if (isDeviceExist) return res.json(await isDeviceExist.update({ rating: midValue }))

		return res.json('The rating has been created')
	}

	public async getByUser(req: Request, res: Response): Promise<Response<number>> {
		const { UserId, DeviceId }: GetQuery = req.query as unknown as GetQuery
		const userRate: Model<IRating, {}> | null = await Rating.findOne({ where: { UserId, DeviceId } })

		if (userRate) return res.json(userRate.dataValues.rate)

		return res.json(0)
	}
}

export default new RatingController()
