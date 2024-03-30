import express, { Router } from 'express'
import ROUTE from '../AppRoutes'
import CategoryController from '../controllers/CategoryController'
import RoleMiddleware from '../middleware/RoleMiddleware'

export default class CategoryRouter {
	diRouter: Router
	categoryController: typeof CategoryController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.categoryController = CategoryController
		this.categoryRouter()
	}

	private categoryRouter(): void {
		this.diRouter.post(ROUTE.CATEGORY_CREATE, RoleMiddleware(['ADMIN']) as express.RequestHandler, this.categoryController.create)
		this.diRouter.get(ROUTE.CATEGORY_GET_ALL, this.categoryController.getAll)
	}
}
