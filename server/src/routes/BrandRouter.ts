import express, { Router } from 'express'
import ROUTE from '../AppRoutes'
import BrandController from '../controllers/BrandController'
import RoleMiddleware from '../middleware/RoleMiddleware'

export default class BrandRouter {
	diRouter: Router
	brandController: typeof BrandController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.brandController = BrandController
		this.brandRouter()
	}

	private brandRouter(): void {
		this.diRouter.post(ROUTE.BRAND_CREATE, RoleMiddleware(['ADMIN']) as express.RequestHandler, this.brandController.create)
		this.diRouter.get(ROUTE.BRAND_GET_ALL, this.brandController.getAll)
	}
}
