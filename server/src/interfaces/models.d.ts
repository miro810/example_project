export declare interface IUser {
	id: number
	email: string
	password: string
	role: string
	img?: string
}

export declare interface ICart {
	id: number
}

export declare interface ICartDevice {
	id: number
	CartId: number
	DeviceId: number
	count: number
}

export declare interface IDevice {
	id: number | undefined
	name: string
	price: number
	rating: number
	img: string
	BrandId?: string
	CategoryId?: string
}

export declare interface IDeviceInfo {
	id: number
	title: string
	description: string
	DeviceInfoId?: string
}

export declare interface ICategory {
	id: number
	name: string
}

export declare interface IBrand {
	id: number
	name: string
}

export declare interface IRating {
	id: number
	rate: number
	UserId: number
	DeviceId: number
}
