'use client'
import type { IResponse } from '@/app/adminPage/page'
import ROUTE from '@/axios/AppRoutes'
import { $api, ErrorException } from '@/axios/axiosApi'
import { Center, Flex, Input, Modal, Select, Text } from '@/components/clientWrapper'
import FileUploader from '@/utils/FileUploader'
import LayoutLoader from '@/utils/LayoutLoader'
import notificationsHandler from '@/utils/notificationsHandler'
import { Button } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Session } from 'next-auth'
import React, { useState } from 'react'

type IDeviceProps = {
	session: Session
	isVisible: boolean
	categorySelector: IResponse | null
	brandSelector: IResponse | null
	setIsVisible(args: boolean): void
}

type TDeviceProperty = {
	title?: string | null
	description?: string | null
}

interface IRequest {
	name?: string | null
	price?: number | null
	BrandId?: number | null
	CategoryId?: number | null
	img?: File | null
	deviceProperty?: TDeviceProperty
}

function isExist(e: React.ChangeEvent<HTMLInputElement>, prev: IRequest | null, value: string): TDeviceProperty | string {
	if (e.target.attributes[2].value === 'title' || e.target.attributes[2].value === 'description')
		return { ...prev?.deviceProperty, [e.target.attributes[2].value]: value }

	return value
}

export default function DeviceModal({ session, isVisible, categorySelector, brandSelector, setIsVisible }: IDeviceProps) {
	const [request, setRequest] = useState<IRequest>({
		BrandId: brandSelector?.rows.length ? brandSelector?.rows[0].id : 0,
		CategoryId: categorySelector?.rows.length ? categorySelector?.rows[0].id : 0,
		deviceProperty: {
			title: `Title: ${Date.now()}`,
			description: `Description: ${Date.now()}`,
		},
	})

	function valueChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value }: { name: string; value: string } = e.target
		setRequest((prev: IRequest | null): IRequest => ({ ...prev, [name]: isExist(e, prev, value) }))
	}

	function changeImage(e: React.ChangeEvent<HTMLInputElement>): void {
		setRequest((prev: IRequest | null): IRequest => ({ ...prev, img: e.target.files && e.target.files[0] }))
	}

	async function sendRequest(): Promise<void> {
		async function main(): Promise<void | Error> {
			if (!request?.img) return ErrorException('Image is not attached!')
			if (
				(request &&
					Object.values(request).length < 6 &&
					Object.values(request).every((v) => !!v) &&
					!request.deviceProperty?.title &&
					!request.deviceProperty?.description) ||
				!request
			)
				return ErrorException('Enter all product fields!')

			await $api.post<never, never, IRequest>(
				ROUTE.DEVICE_CREATE,
				{
					name: request.name,
					price: request.price,
					BrandId: request.BrandId,
					CategoryId: request.CategoryId,
					img: request.img,
					deviceProperty:
						`{"title":"${request.deviceProperty?.title}","description":"${request.deviceProperty?.description}"}` as TDeviceProperty,
				},
				{
					headers: {
						Authorization: `Bearer ${session.user.token}`,
						'Content-Type': 'multipart/form-data',
					},
				},
			)
		}

		await notificationsHandler({
			fx: main,
			id: 'addDevice',
			notificationTitle: 'Request status:',
			pendingMessage: 'Uploading...',
			fulfilledMessage: 'Successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})

		setRequest({
			name: null,
			price: null,
			BrandId: request.BrandId,
			CategoryId: request.CategoryId,
			img: request.img,
			deviceProperty: {
				title: `Title: ${Date.now()}`,
				description: `Description: ${Date.now()}`,
			},
		})
	}

	if (!brandSelector || !categorySelector) return <LayoutLoader />

	return (
		<Modal keepMounted={false} opened={isVisible} onClose={() => setIsVisible(false)} title={'Create new Product:'}>
			<Select
				pt={20}
				placeholder={'Select brand:'}
				defaultValue={String(request.BrandId)}
				onChange={(value: string) => setRequest((prev: IRequest | null): IRequest => ({ ...prev, BrandId: Number(value) }))}
				name={'BrandId'}
				dropdownPosition={'bottom'}
				maxDropdownHeight={190}
				data={brandSelector.rows.map((item) => ({ value: String(item.id), label: item.name }))}
			/>
			<Select
				pt={20}
				placeholder={'Select category:'}
				defaultValue={String(request.CategoryId)}
				onChange={(value: string) => {
					setRequest((prev: IRequest | null): IRequest => ({ ...prev, CategoryId: Number(value) }))
				}}
				name={'BrandId'}
				dropdownPosition={'bottom'}
				maxDropdownHeight={200}
				data={categorySelector.rows.map((item) => ({ value: String(item.id), label: item.name }))}
			/>
			<Input pt={20} placeholder={'Product name:'} name={'name'} type={'text'} value={request?.name || ''} onChange={valueChange} />
			<Input
				pt={20}
				placeholder={'Product price:'}
				name={'price'}
				type={'number'}
				value={request?.price || ''}
				onChange={valueChange}
			/>
			<Input
				pt={20}
				placeholder={'Product title:'}
				name={'deviceProperty'}
				datatype={'title'}
				type={'text'}
				value={request.deviceProperty?.title || ''}
				onChange={valueChange}
			/>
			<Input
				pt={20}
				placeholder={'Product description:'}
				name={'deviceProperty'}
				datatype={'description'}
				type={'text'}
				value={request.deviceProperty?.description || ''}
				onChange={valueChange}
			/>
			<Flex pt={10} direction={'row'} justify={'center'} align={'center'}>
				<Text fz={'md'} fw={400} lineClamp={1} miw={70}>
					File name:
				</Text>
				<Text pl={5} fw={700} lineClamp={1} maw={320}>
					{request?.img?.name ? request.img.name : 'null'}
				</Text>
			</Flex>
			<Center pt={10}>
				<FileUploader acceptType={'image/*'} onChangeInput={changeImage}>
					<Button radius={'md'} variant={'light'}>
						Upload image
					</Button>
				</FileUploader>
			</Center>
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
