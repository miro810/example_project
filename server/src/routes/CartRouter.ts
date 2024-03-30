import { Router } from 'express'
import ROUTE from '../AppRoutes'
import CartController from '../controllers/CartController'

export default class CartRouter {
	diRouter: Router
	cartController: typeof CartController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.cartController = CartController
		this.deviceRouter()
	}

	private deviceRouter(): void {
		this.diRouter.post(ROUTE.CART_ADD_PRODUCT, this.cartController.addOrUpdateDevice)
		this.diRouter.post(ROUTE.CART_REMOVE_PRODUCT, this.cartController.removeDevice)
		this.diRouter.get(ROUTE.CART_GET_ALL, this.cartController.getAll)
	}
}
