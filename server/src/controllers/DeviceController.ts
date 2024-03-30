import type { NextFunction, Request, Response } from 'express'
import type { UploadedFile } from 'express-fileupload'
import fs from 'fs'
import path, { dirname } from 'path'
import type { Model } from 'sequelize'
import { Op } from 'sequelize'
import { fileURLToPath } from 'url'
import { v4 as uuidV4 } from 'uuid'
import { Brand, Category, Device, DeviceInfo } from '../SQLmodels/models'
import ApiError from '../error/ApiError'
import type { IDevice, IDeviceInfo } from '../interfaces/models'

type GetAllResponse = { rows: Model<IDevice, {}>[]; count: number } | Model<IDevice, {}>[] | null
type Image = { img: UploadedFile | null | undefined }
type TRequest = {
	name: string
	price: number
	BrandId: string
	CategoryId: string
	deviceProperty: string | IDeviceInfo | null
}
type MyQuery = {
	BrandId: string | null | undefined
	CategoryId: string | null | undefined
	limit: number | null | undefined
	page: number | null | undefined
	infinity: boolean | null | undefined
	searchQuery: string | null | undefined
}

class DeviceController {
	public async create(req: Omit<Request, 'body'> & { body: TRequest }, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			let { name, price, BrandId, CategoryId, deviceProperty } = req.body
			let { img }: Image = req.files as Image
			if (!name || !price || !BrandId || !CategoryId) return next(ApiError.BadRequest('Input data not correct'))
			if (!img) return next(ApiError.BadRequest('Image is not attached!'))
			let fileName: string = uuidV4() + '.jpg'

			// fileURLToPath(import.meta.url) = ./dist/controllers/deviceController.js as executable file
			const execFile: string = fileURLToPath(import.meta.url)
			const staticFolder: string = path.resolve(dirname(execFile), '..', 'static')
			const folderPath: string = path.resolve(dirname(execFile), '..', 'static', 'deviceImages')

			if (!fs.existsSync(staticFolder)) fs.mkdirSync(staticFolder)
			if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
			await img!.mv(path.resolve(dirname(execFile), '..', 'static', 'deviceImages', fileName))
			const device: Model<IDevice, {}> = await Device.create({ name, price, BrandId, CategoryId, img: '/deviceImages/' + fileName })

			deviceProperty = JSON.parse(deviceProperty as string) as IDeviceInfo
			await DeviceInfo.create<Model<IDeviceInfo, {}>>({
				title: deviceProperty.title,
				description: deviceProperty.description,
				DeviceInfoId: device.dataValues.id,
			})

			return res.json(device)
		} catch (e: any) {
			next(ApiError.BadRequest(e.message))
		}
	}

	public async getAll(req: Request, res: Response): Promise<Response<GetAllResponse> | void> {
		let { BrandId, CategoryId, limit, page, infinity, searchQuery }: MyQuery = req.query as MyQuery
		let data: GetAllResponse = null
		page = page || 1
		limit = limit || 6
		let offset: number = page * limit - limit

		if (BrandId && CategoryId && !infinity && !searchQuery)
			data = await Device.findAndCountAll({ where: { BrandId, CategoryId }, limit, offset, order: [['id', 'ASC']] })
		if (BrandId && !CategoryId && !infinity && !searchQuery)
			data = await Device.findAndCountAll({ where: { BrandId }, limit, offset, order: [['id', 'ASC']] })
		if (!BrandId && CategoryId && !infinity && !searchQuery)
			data = await Device.findAndCountAll({ where: { CategoryId }, limit, offset, order: [['id', 'ASC']] })
		if (!BrandId && !CategoryId && searchQuery && !infinity)
			data = await Device.findAndCountAll({
				where: {
					name: {
						[Op.iRegexp]: searchQuery,
					},
				},
				order: [['id', 'ASC']],
			})
		if (!BrandId && !CategoryId && !infinity && !searchQuery)
			data = await Device.findAndCountAll({ limit, offset, order: [['id', 'ASC']] })
		if (!BrandId && !CategoryId && infinity) data = await Device.findAndCountAll({ order: [['id', 'ASC']] })

		return res.json(data)
	}

	public async getOne(req: Request<{ id: number }>, res: Response): Promise<Response<Model<IDevice, {}> | null> | void> {
		const { id }: { id: number } = req.params
		const device: Model<IDevice, {}> | null = await Device.findOne({
			where: { id },
			include: [
				{ model: DeviceInfo, as: 'DeviceInfo', attributes: { exclude: ['id'] } },
				{ model: Category, as: 'Category', attributes: { exclude: ['id'] } },
				{ model: Brand, as: 'Brand', attributes: { exclude: ['id'] } },
			],
		})

		return res.json(device)
	}
}

export default new DeviceController()
