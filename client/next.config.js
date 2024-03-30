const { join } = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	crossOrigin: false,
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**',
			},
		],
		domains: ['localhost', '127.0.0.1', '192.168.0.100', process.env.HOSTNAME ?? '0.0.0.0'],
	},
	sassOptions: {
		includePaths: [join(__dirname, 'styles')],
	},
	experimental: {
		cpus: 8,
		appDocumentPreloading: true,
		swcMinify: true,
		forceSwcTransforms: true,
	},
}

module.exports = nextConfig
