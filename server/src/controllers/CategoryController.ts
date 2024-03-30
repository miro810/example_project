import type { Request, Response } from 'express'
import type { Model } from 'sequelize'
import { Category } from '../SQLmodels/models'
import type { ICategory } from '../interfaces/models'

type GetAllResponse = { rows: Model<ICategory, {}>[]; count: number } | null

class CategoryController {
	public async create(req: Request, res: Response): Promise<Response | void> {
		const { name }: ICategory = req.body
		const type: Model<ICategory, {}> = await Category.create({ name })

		return res.json(type)
	}

	public async getAll(req: Request, res: Response): Promise<Response<GetAllResponse> | void> {
		const types: GetAllResponse = await Category.findAndCountAll()

		return res.json(types)
	}
}

export default new CategoryController()
