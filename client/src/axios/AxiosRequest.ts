import ROUTE from '@/axios/AppRoutes'
import { $api } from '@/axios/axiosApi'
import type { AxiosResponse } from 'axios'
import type { Session } from 'next-auth'
import type { Dispatch, SetStateAction } from 'react'

export type Device = {
	id: number
	name: string
	price: number
	rating: number
	img: string | File | null | undefined
	CategoryId: string
	BrandId: string
	Category: {
		name: string
	}
	Brand: {
		name: string
	}
	DeviceInfo: {
		title: string
		description: string
	}
}

export type Cart = {
	id: number
	DeviceId: number
	count: number
}

export interface IResponse<T> {
	count: number
	rows: T[]
}

type IDeviceFunction<T> = {
	id: string | number
	setData?: Dispatch<SetStateAction<T | null>>
	status?: 'authenticated' | 'loading' | 'unauthenticated'
	session?: Session | null
	setValue?: Dispatch<SetStateAction<number>>
}

export default abstract class AxiosRequest {
	public static async fetchAllProducts(page?: number): Promise<IResponse<Device>> {
		const { data }: AxiosResponse<IResponse<Device>> = await $api.get(ROUTE.DEVICE_GET_ALL, {
			params: {
				page: page,
			},
		})

		return data
	}

	public static async fetchSearchAutoCompleteData(searchQuery: string): Promise<IResponse<Device>> {
		const { data }: AxiosResponse<IResponse<Device>> = await $api.get(ROUTE.DEVICE_GET_ALL, {
			params: {
				searchQuery: searchQuery,
			},
		})

		return data
	}

	public static async fetchOneProduct<T>(args: IDeviceFunction<T>): Promise<T | void> {
		try {
			const { data }: AxiosResponse<T> = await $api.get(ROUTE.DEVICE_GET_BY_ID + args.id)
			args.setData && args.setData(data)

			if (args.status == 'authenticated') {
				const { data: rate } = await $api.get(ROUTE.RATING_GET_BY_USER, {
					params: {
						UserId: args.session?.user.id,
						DeviceId: (data as Device).id,
					},
				})
				args.setValue && args.setValue(rate)
			}
			if (args.status == 'unauthenticated' && args.setValue) args.setValue((data as Device).rating)

			return data
		} catch (e) {
			console.log(e)
		}
	}

	public static async fetchCartProduct(args: IDeviceFunction<Cart[]>): Promise<IResponse<Cart> | void> {
		try {
			const { data }: AxiosResponse<IResponse<Cart>> = await $api.get(ROUTE.CART_GET_ALL, {
				params: {
					CartId: args.id,
				},
			})
			args.setData && args.setData(data.rows)
		} catch (e) {
			console.log(e)
		}
	}
}
