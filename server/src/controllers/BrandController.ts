import type { Request, Response } from 'express'
import type { Model } from 'sequelize'
import { Brand } from '../SQLmodels/models'
import type { IBrand } from '../interfaces/models'

type GetAllResponse = { rows: Model<IBrand, {}>[]; count: number } | null

class BrandController {
	public async create(req: Request, res: Response): Promise<Response | void> {
		const { name } = req.body
		const brand: Model<IBrand, {}> = await Brand.create({ name })

		return res.json(brand)
	}

	public async getAll(req: Request, res: Response): Promise<Response<GetAllResponse> | void> {
		const brands: GetAllResponse = await Brand.findAndCountAll()

		return res.json(brands)
	}
}

export default new BrandController()
