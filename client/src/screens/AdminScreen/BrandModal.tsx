'use client'
import ROUTE from '@/axios/AppRoutes'
import { $api, ErrorException } from '@/axios/axiosApi'
import { Center, Flex, Input, Modal } from '@/components/clientWrapper'
import notificationsHandler from '@/utils/notificationsHandler'
import { Button } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import type { Session } from 'next-auth'
import { useState } from 'react'

interface IBrandProps {
	session: Session
	isVisible: boolean
	setIsVisible(arg: boolean): void
	reRender?(): Promise<void>
}

export default function BrandModal({ session, isVisible, setIsVisible, reRender }: IBrandProps) {
	const [value, setValue] = useState<string>('')

	async function sendRequest(): Promise<void> {
		async function main(): Promise<void | Error> {
			if (value.length === 0) return ErrorException('Field is empty!')
			await $api.post(
				ROUTE.BRAND_CREATE,
				{ name: value },
				{
					headers: {
						Authorization: `Bearer ${session.user.token}`,
						'Content-Type': 'application/json',
					},
				},
			)
		}

		await notificationsHandler({
			fx: main,
			id: 'addBrand',
			notificationTitle: 'Request status:',
			pendingMessage: 'Uploading...',
			fulfilledMessage: 'Successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})

		setIsVisible(false)
		setValue('')
		if (reRender) await reRender()
	}

	return (
		<Modal keepMounted={false} opened={isVisible} onClose={() => setIsVisible(false)} title={'Create new Brand:'}>
			<Input placeholder={'Enter new brand name:'} type={'text'} value={value} onChange={(e) => setValue(e.target.value)} />
			<Center>
				<Flex w={222} pt={14} justify={'space-around'} align={'center'}>
					<Button onClick={sendRequest} w={94} radius={'md'} color={'teal'} variant={'light'}>
						Create
					</Button>
					<Button onClick={() => setIsVisible(false)} w={94} radius={'md'} color={'red'} variant={'light'}>
						Cancel
					</Button>
				</Flex>
			</Center>
		</Modal>
	)
}
