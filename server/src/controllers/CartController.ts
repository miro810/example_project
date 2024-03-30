import type { NextFunction, Request, Response } from 'express'
import type { Model } from 'sequelize'
import { CartDevice } from '../SQLmodels/models'
import ApiError from '../error/ApiError'
import type { ICartDevice } from '../interfaces/models'

type GetAllResponse = { rows: Model<ICartDevice, {}>[]; count: number } | Model<ICartDevice, {}>[] | null

class CartController {
	public async addOrUpdateDevice(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		const { CartId, DeviceId, count = 1 } = req.body
		if (!CartId || !DeviceId) return next(ApiError.BadRequest('Set CartId and DeviceId in req.body'))

		const isDeviceExist: Model<ICartDevice, {}> | null = await CartDevice.findOne({ where: { CartId, DeviceId } })

		if (isDeviceExist) return res.json(await isDeviceExist.update({ CartId, DeviceId, count }))

		const cartDevice: Model<ICartDevice, {}> = await CartDevice.create({ CartId, DeviceId, count })

		return res.json(cartDevice)
	}

	public async removeDevice(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		const { CartId, DeviceId } = req.body
		if (!CartId || !DeviceId) return next(ApiError.BadRequest('Set CartId and DeviceId in req.body'))

		const device: Model<ICartDevice, {}> | null = await CartDevice.findOne({ where: { CartId, DeviceId } })
		if (device) await device.destroy()

		return res.json(device)
	}

	public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<GetAllResponse | void> | void> {
		const { CartId }: { CartId: string } = req.query as { CartId: string }
		if (!CartId) return next(ApiError.BadRequest('Set CartId in req.query'))

		const devices: GetAllResponse = await CartDevice.findAndCountAll({
			where: { CartId },
			attributes: ['id', 'DeviceId', 'count'],
		})

		return res.json(devices)
	}
}

export default new CartController()
