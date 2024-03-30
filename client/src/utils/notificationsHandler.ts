import { notifications } from '@/components/clientWrapper'
import { AxiosError } from 'axios'
import type React from 'react'

interface IOptions {
	fx(): Promise<void | Error>
	id: string
	notificationTitle: string
	pendingMessage: string
	fulfilledMessage: string
	fulfilledIcon: React.JSX.Element
	rejectedIcon: React.JSX.Element
	silent?: boolean | null | undefined
}

export default async function (options: IOptions): Promise<void> {
	try {
		notifications.clean()
		if (!options.silent) {
			notifications.show({
				id: options.id,
				withCloseButton: false,
				title: options.notificationTitle,
				message: options.pendingMessage,
				loading: true,
				autoClose: false,
			})
		}

		await options.fx()

		if (!options.silent) {
			notifications.update({
				id: options.id,
				withCloseButton: true,
				title: options.notificationTitle,
				icon: options.fulfilledIcon,
				color: 'teal',
				message: options.fulfilledMessage,
				autoClose: 4000,
			})
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			notifications.update({
				id: options.id,
				withCloseButton: true,
				title: options.notificationTitle,
				icon: options.rejectedIcon,
				color: 'red',
				message: `Error: ${(e as Error).message}`,
				autoClose: 2500,
			})
		}

		if (e instanceof AxiosError) {
			let error: string

			if (e.message && e.request.status === 0) error = e.message
			else error = e.response!.data.message

			notifications.update({
				id: options.id,
				withCloseButton: true,
				title: options.notificationTitle,
				icon: options.rejectedIcon,
				color: 'red',
				message: `Error: ${error}`,
				autoClose: 2500,
			})
		}
	}
}
