import ROUTE from '@/axios/AppRoutes'
import { $api } from '@/axios/axiosApi'
import { AxiosError, AxiosResponse } from 'axios'
import jwt from 'jsonwebtoken'
import type { NextAuthOptions, Session, User } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
	pages: {
		signIn: '/signIn',
		signOut: '/',
		newUser: '/',
	},
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60,
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email:',
					type: 'email',
					placeholder: 'Your email',
				},
				password: {
					label: 'Password:',
					type: 'password',
					placeholder: 'Your password',
				},
			},
			async authorize(credentials: Record<'email' | 'password', string> | void): Promise<User | null> {
				try {
					if (!credentials?.email || !credentials?.password) return Promise.reject(new Error('Credentials not exist'))

					const { email, password }: { email: string; password: string } = credentials
					const res: AxiosResponse<{ token: string }> = await $api.post(ROUTE.USER_LOGIN, {
						email: email,
						password: password,
					})

					let decodedUserToken: User = (await jwt.decode(res.data.token, { json: true })) as User
					decodedUserToken.token = res.data.token

					return Promise.resolve(decodedUserToken)
				} catch (e: unknown) {
					if (e instanceof AxiosError) {
						if (!e.response?.data?.message) return { id: 'undefined', error: e.cause!.toString().split('Error: ')[1] }

						return { id: 'undefined', error: e.response.data.message }
					}

					return null
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user }: { user: User | AdapterUser }): Promise<boolean> {
			if (user?.error) return Promise.reject(new Error(user.error))

			return Promise.resolve(true)
		},
		async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
			if (!session) throw new Error('Session not exist')

			session.user.id = token.id
			session.user.email = token.email
			session.user.role = token.role
			session.user.img = token.img
			session.user.token = token.token

			return Promise.resolve(session)
		},
		async jwt({ token, user, trigger, session }) {
			if (!token) throw new Error('Error: callbacks: jwt()')

			if (user) {
				token.id = user.id
				token.email = user.email
				token.role = user.role
				token.img = user.img
				token.token = user.token
			}

			if (trigger === 'update') return { ...token, ...session.user }

			return { ...token, ...user }
		},
	},
}
