import ROUTE from '@/axios/AppRoutes'
import AxiosRequest, { Device } from '@/axios/AxiosRequest'
import { $api } from '@/axios/axiosApi'
import { Button, Card, Center, Flex, Group, Text } from '@/components/clientWrapper'
import CartLoader from '@/screens/CartScreen/CartLoader'
import Image from 'next/legacy/image'
import { useEffect, useState } from 'react'

interface ICartItem {
	CartId: number
	DeviceId: number
	count: number
	reRender(): Promise<void>
}

export default function CartItem({ CartId, DeviceId, count, reRender }: ICartItem) {
	const [device, setDevice] = useState<Device | null>(null)
	const url: string = process.env.NEXT_PUBLIC_API_URL as string

	async function initLoad(): Promise<void> {
		await AxiosRequest.fetchOneProduct<Device>({ id: DeviceId, setData: setDevice })
	}

	async function deleteItem(): Promise<void> {
		await $api.post(ROUTE.CART_REMOVE_PRODUCT, {
			CartId: CartId,
			DeviceId: DeviceId,
		})
		await reRender()
	}

	useEffect((): void => {
		if (!device) void initLoad()
	}, [device])

	if (!device) return <CartLoader />

	return (
		<Card radius={'md'} style={{ maxWidth: 252 }}>
			<Center pl={16} pr={16}>
				<Card.Section p={16} style={{ width: '220px', height: '220px', position: 'relative' }}>
					<Image
						quality={100}
						placeholder={'blur'}
						src={url + device.img}
						blurDataURL={url + device.img}
						layout={'fill'}
						loading={'lazy'}
						alt={''}
					/>
				</Card.Section>
			</Center>

			<Flex direction={'column'} justify={'center'} align={'center'}>
				<Text fw={400} mt={'xs'}>
					{device.name}
				</Text>
				<Text fw={400} weight={252}>
					Total: {device.price * count}$
				</Text>
				<Group position={'left'} mt={'xs'}>
					<Button w={94} radius={'md'} color={'red'} variant={'light'} onClick={deleteItem}>
						Delete
					</Button>
				</Group>
			</Flex>
		</Card>
	)
}
