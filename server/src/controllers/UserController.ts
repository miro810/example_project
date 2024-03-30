import bcrypt from 'bcryptjs'
import type { NextFunction, Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import fs, { unlink } from 'fs'
import type { SignOptions } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import path, { dirname } from 'path'
import type { Model } from 'sequelize'
import { fileURLToPath } from 'url'
import { v4 as uuidV4 } from 'uuid'
import { Cart, User } from '../SQLmodels/models'
import ApiError from '../error/ApiError'
import type { ICart, IUser } from '../interfaces/models'
import type { TRequestBody } from '../interfaces/utils'

type Image = { img: UploadedFile | null | undefined }
type Registration = Response<{ user: Model<IUser, {}>; cart: Model<ICart, {}>; token: string }> | void

const secret: string = process.env.SECRET_KEY as string
const options: SignOptions = { expiresIn: '24h', algorithm: 'HS256', noTimestamp: false }

class UserController {
	public async registration(req: Request, res: Response, next: NextFunction): Promise<Registration> {
		const { email, password, role = 'USER' } = req.body
		if (!email || !password) return next(ApiError.BadRequest('Invalid email or password'))

		const candidate: Model<IUser, {}> | null = await User.findOne({ where: { email } })
		if (candidate) return next(ApiError.BadRequest(`User with email: ${email} exists in database`))

		const hashPassword: string = await bcrypt.hash(password, 2)
		const user: Model<IUser, {}> = await User.create({ email, password: hashPassword, role })
		const cart: Model<ICart, {}> = await Cart.create({ UserId: user.dataValues.id })
		const token: string = jwt.sign({ id: user.dataValues.id, email, role }, secret, options)

		return res.json({ user, cart, token })
	}

	public async login(req: Request, res: Response, next: NextFunction): Promise<Response<string> | void> {
		const { email, password } = req.body
		if (!email || !password) return next(ApiError.BadRequest('Invalid email or password'))

		const user: Model<IUser, {}> | null = await User.findOne({ where: { email } })
		if (!user) return next(ApiError.Internal('User not found'))

		let comparePassword: boolean = bcrypt.compareSync(password, user.dataValues.password)
		if (!comparePassword) return next(ApiError.Internal('Invalid password'))

		const token: string = jwt.sign(
			{
				id: user.dataValues.id,
				email: user.dataValues.email,
				role: user.dataValues.role,
				img: user.dataValues.img,
			},
			secret,
			options,
		)

		return res.json({ token })
	}

	public async verifyToken(req: TRequestBody, res: Response, next: NextFunction): Promise<Response<string> | void> {
		const { id, email } = req.body.userRawData
		if (!id || !email) return next(ApiError.BadRequest('Invalid id or password'))

		const user: Model<IUser, {}> | null = await User.findOne({ where: { email } })
		if (!user) return next(ApiError.Internal('User not found'))

		const token: string = jwt.sign(
			{
				id: user.dataValues.id,
				email: user.dataValues.email,
				role: user.dataValues.role,
				img: user.dataValues.img,
			},
			secret,
			options,
		)

		return res.json({ token })
	}

	public async changeProfileImage(req: Request, res: Response): Promise<Response<string> | void> {
		let { id, prevImg }: { id: number; prevImg: string | undefined } = req.body
		const { img }: Image = req.files as Image
		let fileName: string = uuidV4() + '.jpg'

		const execFile: string = fileURLToPath(import.meta.url)
		const staticFolder: string = path.resolve(dirname(execFile), '..', 'static')
		const folderPath: string = path.resolve(dirname(execFile), '..', 'static', 'profileImages')

		if (!fs.existsSync(staticFolder)) fs.mkdirSync(staticFolder)
		if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
		await img!.mv(path.resolve(dirname(execFile), '..', 'static', 'profileImages', fileName))
		if (prevImg) unlink(path.resolve(dirname(execFile), '..', 'static', 'profileImages', prevImg), (): void => {})

		const user: Model<IUser, {}> | null = await User.findOne({
			where: { id },
			attributes: { include: ['id', 'email', 'role', 'img'], exclude: ['password'] },
		})
		if (user) await user.update({ img: '/profileImages/' + fileName })

		return res.json(user)
	}
}

export default new UserController()
