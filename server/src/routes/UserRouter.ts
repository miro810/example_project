import express, { Router } from 'express'
import ROUTE from '../AppRoutes'
import UserController from '../controllers/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'

export default class UserRouter {
	diRouter: Router
	userController: typeof UserController

	constructor(diRouter: Router) {
		this.diRouter = diRouter
		this.userController = UserController
		this.userRoutes()
	}

	private userRoutes(): void {
		this.diRouter.post(ROUTE.USER_REGISTRATION, this.userController.registration)
		this.diRouter.post(ROUTE.USER_LOGIN, this.userController.login)
		this.diRouter.post(ROUTE.USER_CHANGE_IMAGE, this.userController.changeProfileImage)
		this.diRouter.get(ROUTE.USER_AUTH, AuthMiddleware as express.RequestHandler, this.userController.verifyToken)
	}
}
