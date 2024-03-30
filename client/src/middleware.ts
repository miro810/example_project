import { JWT } from 'next-auth/jwt'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
	async function middleware(request: NextRequestWithAuth): Promise<NextResponse | void> {
		function roleGuard(path: string, roles: string | string[]): boolean | null {
			const currentRole: string = request.nextauth.token?.role!

			return request.nextUrl.pathname.startsWith(path) && !roles.includes(currentRole)
		}

		function redefineRoute(url: string): NextResponse {
			return NextResponse.rewrite(new URL(url, request.url))
		}

		if (roleGuard('/adminPage', 'ADMIN')) return redefineRoute('/denied')
		if (roleGuard('/userPage', ['ADMIN', 'USER'])) return redefineRoute('/denied')
		if (roleGuard('/cartPage', ['ADMIN', 'USER'])) return redefineRoute('/denied')
	},
	{
		callbacks: {
			authorized: ({ token }: { token: JWT | null }) => !!token,
		},
	},
)

export const config = {
	matcher: ['/userPage/:path*', '/cartPage/:path*', '/adminPage/:path*'],
}
