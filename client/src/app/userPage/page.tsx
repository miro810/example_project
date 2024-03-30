'use client'
import ROUTE from '@/axios/AppRoutes'
import { $api } from '@/axios/axiosApi'
import { Avatar, Button, Container, Flex, Title } from '@/components/clientWrapper'
import FileUploader from '@/utils/FileUploader'
import LayoutLoader from '@/utils/LayoutLoader'
import notificationsHandler from '@/utils/notificationsHandler'
import { IconCheck, IconX } from '@tabler/icons-react'
import type { AxiosResponse } from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface IResponse {
	id: number
	email: string
	role: 'USER' | 'ADMIN'
	img: string
}

export default function Page() {
	const { push } = useRouter()
	const { data: session, status, update } = useSession({ required: true })
	const url: string = process.env.NEXT_PUBLIC_API_URL + session?.user.img

	async function changeImage(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
		async function main(): Promise<void> {
			const formData: FormData = new FormData()
			session && formData.append('id', String(session.user.id))
			session?.user.img && formData.append('prevImg', String(session.user.img).split('/')[2])
			e.target.files && formData.append('img', e.target.files[0])

			const response: AxiosResponse<IResponse> = await $api.post(ROUTE.USER_CHANGE_IMAGE, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			await update({
				...session,
				user: {
					...session?.user,
					img: response.data.img,
				},
			})
		}

		await notificationsHandler({
			fx: main,
			id: 'changeImage',
			notificationTitle: 'Uploading status:',
			pendingMessage: 'Uploading...',
			fulfilledMessage: 'Successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})
	}

	if (status === 'loading') return <LayoutLoader />
	if (status !== 'authenticated') return push('/denied')

	return (
		<Container fluid size={'xs'} pt={20}>
			<Flex direction={'column'} justify={'center'} align={'center'}>
				<Title>User Page:</Title>
				<Title>{session.user.email}</Title>
				<Title>Role: {session.user.role}</Title>
			</Flex>
			<Flex pt={20} direction={'column'} justify={'center'} align={'center'}>
				{session?.user.img ? (
					<Avatar w={220} h={220} src={url} alt={''} radius={'md'} />
				) : (
					<Avatar w={220} h={220} alt={''} radius={'md'} />
				)}
				<Flex pt={20} justify={'center'} align={'center'}>
					<FileUploader acceptType={'image/*'} onChangeInput={changeImage}>
						<Button radius={'md'}>Upload image</Button>
					</FileUploader>

					<Button
						ml={8}
						radius={'md'}
						onClick={(): void => {
							alert(JSON.stringify(session?.user))
							console.log(session?.user)
						}}
					>
						Session
					</Button>
				</Flex>
			</Flex>
		</Container>
	)
}
