import { DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

interface IUserRawData extends DefaultUser {
	id: string
	name?: string | null | undefined
	email?: string | null | undefined
	img?: string | null | undefined
	role?: string | null | undefined
	token?: string | null | undefined
	error?: string | null | undefined
	iat?: number | null | undefined
	exp?: number | null | undefined
}

declare module 'next-auth' {
	interface Session {
		user: IRawUserData
	}

	export interface User extends IUserRawData {}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT, IUserRawData {}
}
