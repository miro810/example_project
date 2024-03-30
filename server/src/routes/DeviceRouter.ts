import express, { Router } from 'express'
import ROUTE from '../AppRoutes'
import DeviceController from '../controllers/DeviceController'
import RoleMiddleware from '../middleware/RoleMiddleware'

export default class DeviceRouter {
	diRouter: Router
	deviceController: typeof DeviceController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.deviceController = DeviceController
		this.deviceRouter()
	}

	private deviceRouter(): void {
		this.diRouter.post(ROUTE.DEVICE_CREATE, RoleMiddleware(['ADMIN']) as express.RequestHandler, this.deviceController.create)
		this.diRouter.get(ROUTE.DEVICE_GET_ALL, this.deviceController.getAll)
		this.diRouter.get(ROUTE.DEVICE_GET_BY_ID, this.deviceController.getOne)
	}
}
