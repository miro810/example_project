import { Router } from 'express'
import ROUTE from '../AppRoutes'
import RatingController from '../controllers/RatingController'

export default class RatingRouter {
	diRouter: Router
	ratingController: typeof RatingController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.ratingController = RatingController
		this.ratingRouter()
	}

	private ratingRouter(): void {
		this.diRouter.post(ROUTE.RATING_CREATE, this.ratingController.addOrUpdateRating)
		this.diRouter.get(ROUTE.RATING_GET_BY_USER, this.ratingController.getByUser)
	}
}
