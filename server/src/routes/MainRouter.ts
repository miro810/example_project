import { Router } from 'express'
import BrandRouter from './BrandRouter'
import CartRouter from './CartRouter'
import CategoryRouter from './CategoryRouter'
import DeviceRouter from './DeviceRouter'
import RatingRouter from './RatingRouter'
import UserRouter from './UserRouter'

export default class MainRouter {
	initialRouter: Router
	userRouter: UserRouter
	cartRouter: CartRouter
	deviceRouter: DeviceRouter
	typeRouter: CategoryRouter
	brandRouter: BrandRouter
	ratingRouter: RatingRouter

	constructor() {
		this.initialRouter = Router({ mergeParams: true })
		this.userRouter = new UserRouter(this.initialRouter)
		this.cartRouter = new CartRouter(this.initialRouter)
		this.deviceRouter = new DeviceRouter(this.initialRouter)
		this.typeRouter = new CategoryRouter(this.initialRouter)
		this.brandRouter = new BrandRouter(this.initialRouter)
		this.ratingRouter = new RatingRouter(this.initialRouter)

		this.setupRouters()
	}

	private setupRouters(): void {
		this.initialRouter.use('/', this.userRouter.diRouter)
		this.initialRouter.use('/', this.cartRouter.diRouter)
		this.initialRouter.use('/', this.deviceRouter.diRouter)
		this.initialRouter.use('/', this.typeRouter.diRouter)
		this.initialRouter.use('/', this.brandRouter.diRouter)
		this.initialRouter.use('/', this.ratingRouter.diRouter)
	}
}
