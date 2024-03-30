const env = require('dotenv')
const cli = require('next/dist/cli/next-start')
const { resolve } = require('path')

env.config({
	path: resolve(__dirname, '.env.production')
})

cli.nextStart({
	'--hostname': process.env.HOSTNAME || '0.0.0.0',
	'--port': process.env.PORT || 8000,
	_: [],
})
