'use client'
import ROUTE from '@/axios/AppRoutes'
import { $api } from '@/axios/axiosApi'
import { Button, Center, Container, Flex, Loader, Table, Text } from '@/components/clientWrapper'
import BrandModal from '@/screens/AdminScreen/BrandModal'
import CategoryModal from '@/screens/AdminScreen/CategoryModal'
import DeviceModal from '@/screens/AdminScreen/DeviceModal'
import LayoutLoader from '@/utils/LayoutLoader'
import type { AxiosResponse } from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export type IResponse = { count: number; rows: [{ id: number; name: string }] }
type UnionUrl = ROUTE.CATEGORY_GET_ALL | ROUTE.BRAND_GET_ALL | ROUTE.DEVICE_GET_ALL

export default function Page() {
	const { push } = useRouter()
	const { data: session, status } = useSession({ required: true })
	const [render, setRender] = useState<IResponse | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [categoryModal, setCategoryModal] = useState<boolean>(false)
	const [brandModal, setBrandModal] = useState<boolean>(false)
	const [deviceModal, setDeviceModal] = useState<boolean>(false)
	const [categorySelector, setCategorySelector] = useState<IResponse | null>(null)
	const [brandSelector, setBrandSelector] = useState<IResponse | null>(null)

	async function loadData(url: UnionUrl, render: boolean = false): Promise<void> {
		setIsLoading(true)
		if (url === ROUTE.DEVICE_GET_ALL) {
			const { data }: AxiosResponse<IResponse> = await $api
				.get(url, {
					params: {
						infinity: true,
					},
				})
				.finally(() => setIsLoading(false))
			setRender(data)
		} else {
			const { data }: AxiosResponse<IResponse> = await $api.get(url).finally(() => setIsLoading(false))
			if (url === ROUTE.CATEGORY_GET_ALL) setCategorySelector(data)
			if (url === ROUTE.BRAND_GET_ALL) setBrandSelector(data)
			if (render) setRender(data)
		}
	}

	useEffect((): void => {
		if (!render) {
			void loadData(ROUTE.CATEGORY_GET_ALL, true)
			void loadData(ROUTE.BRAND_GET_ALL, false)
		}
	}, [render])

	if (status === 'loading' || !render || !categorySelector || !brandSelector) return <LayoutLoader />
	if (status !== 'authenticated') return push('/denied')

	const rows: React.JSX.Element[] = render.rows.map((genericTable) => (
		<tr key={genericTable.id}>
			<td style={{ width: 60, minWidth: 60, maxWidth: 60 }}>{genericTable.id}</td>
			<td>{genericTable.name}</td>
		</tr>
	))

	return (
		<React.Fragment>
			<Container fluid size={'xs'} pt={20} mb={20}>
				<Text fz={'md'} fw={500} align={'center'}>
					Add new:
				</Text>
				<Flex pt={5} direction={'row'} wrap={'wrap'} gap={'xs'} justify={'center'} align={'center'}>
					<Button w={110} radius={'md'} onClick={() => setCategoryModal(true)}>
						Category
					</Button>
					<Button w={110} radius={'md'} onClick={() => setBrandModal(true)}>
						Brand
					</Button>
					<Button w={110} radius={'md'} onClick={() => setDeviceModal(true)}>
						Product
					</Button>
				</Flex>
				<Text pt={15} fz={'md'} fw={500} align={'center'}>
					Show all:
				</Text>
				<Flex pt={5} direction={'row'} wrap={'wrap'} gap={'xs'} justify={'center'} align={'center'}>
					<Button w={110} radius={'md'} onClick={() => loadData(ROUTE.CATEGORY_GET_ALL, true)}>
						Categories
					</Button>
					<Button w={110} radius={'md'} onClick={() => loadData(ROUTE.BRAND_GET_ALL, true)}>
						Brands
					</Button>
					<Button w={110} radius={'md'} onClick={() => loadData(ROUTE.DEVICE_GET_ALL, true)}>
						Products
					</Button>
				</Flex>
				{isLoading ? (
					<Container pt={20} size={'xs'}>
						<Center mih={148}>
							<Loader size={'xl'} variant={'oval'} />
						</Center>
					</Container>
				) : (
					<Container pt={20} size={'xs'}>
						<Table horizontalSpacing={'sm'} highlightOnHover withBorder withColumnBorders>
							<thead>
								<tr>
									<th>Id:</th>
									<th>Name:</th>
								</tr>
							</thead>
							<tbody>{rows}</tbody>
						</Table>
					</Container>
				)}
			</Container>
			<CategoryModal
				session={session}
				isVisible={categoryModal}
				setIsVisible={setCategoryModal}
				reRender={async (): Promise<void> => loadData(ROUTE.CATEGORY_GET_ALL, true)}
			/>
			<BrandModal
				session={session}
				isVisible={brandModal}
				setIsVisible={setBrandModal}
				reRender={async (): Promise<void> => loadData(ROUTE.BRAND_GET_ALL, false)}
			/>
			<DeviceModal
				session={session}
				isVisible={deviceModal}
				setIsVisible={setDeviceModal}
				categorySelector={categorySelector}
				brandSelector={brandSelector}
			/>
		</React.Fragment>
	)
}
