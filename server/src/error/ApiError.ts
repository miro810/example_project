class ApiError extends Error {
	status: number

	constructor(status: number, message: string = 'ApiError.ts') {
		super()
		this.status = status
		this.message = message
	}

	public static Unauthorized(): ApiError {
		return new ApiError(401, 'User not authorized')
	}

	public static Forbidden(message: string): ApiError {
		return new ApiError(403, message)
	}

	public static BadRequest(message: string): ApiError {
		return new ApiError(404, message)
	}

	public static Internal(message: string): ApiError {
		return new ApiError(500, message)
	}
}

export default ApiError
