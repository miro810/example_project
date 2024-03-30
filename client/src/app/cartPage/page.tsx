'use client'
import type { Cart } from '@/axios/AxiosRequest'
import AxiosRequest from '@/axios/AxiosRequest'
import { Container, Flex, SimpleGrid, Title } from '@/components/clientWrapper'
import CartItem from '@/screens/CartScreen/CartItem'
import LayoutLoader from '@/utils/LayoutLoader'
import notificationsHandler from '@/utils/notificationsHandler'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Page() {
	const { data: session, status } = useSession({ required: true })
	const [cartData, setCartData] = useState<Cart[] | null>(null)

	async function initLoad(): Promise<void> {
		await AxiosRequest.fetchCartProduct({ id: session?.user.id, setData: setCartData })
	}

	async function reRender(): Promise<void> {
		await notificationsHandler({
			fx: initLoad,
			id: 'removeCartProduct',
			notificationTitle: 'Device status:',
			pendingMessage: 'Sending...',
			fulfilledMessage: 'Delete successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})
	}

	useEffect((): void => {
		if (!cartData && session) void initLoad()
	}, [cartData, status])

	if (status === 'loading' && !cartData) return <LayoutLoader />

	return (
		<Container fluid size={'md'} pt={20}>
			<Flex direction={'column'} justify={'center'} align={'center'}>
				{cartData && session && cartData.length > 0 && (
					<SimpleGrid
						pt={20}
						cols={3}
						spacing={'md'}
						breakpoints={[
							{ maxWidth: '62rem', cols: 3, spacing: 'md' },
							{ maxWidth: '52rem', cols: 2, spacing: 'sm' },
							{ maxWidth: '36rem', cols: 1, spacing: 'sm' },
						]}
					>
						{cartData.map((item: Cart) => (
							<CartItem
								key={item.id}
								CartId={session.user.id}
								DeviceId={item.DeviceId}
								count={item.count}
								reRender={reRender}
							/>
						))}
					</SimpleGrid>
				)}
				{cartData && session && cartData.length == 0 && <Title>Add items to cart on the products page</Title>}
			</Flex>
		</Container>
	)
}
