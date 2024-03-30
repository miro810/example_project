import axios, { AxiosInstance } from 'axios'

const $api: AxiosInstance = axios.create({
	withCredentials: true,
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function ErrorException(error: string): Error {
	throw new Error(error)
}

export { $api, ErrorException }
