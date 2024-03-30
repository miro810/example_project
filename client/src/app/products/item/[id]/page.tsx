'use client'
import ROUTE from '@/axios/AppRoutes'
import type { Device } from '@/axios/AxiosRequest'
import AxiosRequest from '@/axios/AxiosRequest'
import { $api, ErrorException } from '@/axios/axiosApi'
import { Box, Button, Container, Group, Input, Loader, Rating, Text, Title, useCounter } from '@/components/clientWrapper'
import ProductsLoader from '@/screens/ProductScreen/ProductsLoader'
import notificationsHandler from '@/utils/notificationsHandler'
import { Center, Flex } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import Image from 'next/legacy/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Page({ params: { id } }: { params: { id: string } }) {
	const { data: session, status } = useSession({ required: false })
	const { push } = useRouter()
	const [value, setValue] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [count, handlers] = useCounter(1, { min: 1 })
	const [device, setDevice] = useState<Device | null>(null)

	async function reRenderPage(): Promise<void> {
		setIsLoading(true)
		void AxiosRequest.fetchOneProduct<Device>({ id, setData: setDevice, status: status, session: session, setValue: setValue })
		setIsLoading(false)
	}

	async function sendData(): Promise<void> {
		async function main(): Promise<void> {
			if (session && device) {
				await $api.post(ROUTE.CART_ADD_PRODUCT, {
					CartId: session.user.id,
					DeviceId: device.id,
					count: count,
				})
			}
		}

		await notificationsHandler({
			fx: main,
			id: 'addCartProduct',
			notificationTitle: 'Device status:',
			pendingMessage: 'Sending...',
			fulfilledMessage: 'Added successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})
	}

	async function changeItemRate(e: number): Promise<void | Error> {
		async function main(): Promise<void | Error> {
			if (session && device) {
				await $api.post(ROUTE.RATING_CREATE, {
					rate: Number(e),
					UserId: session.user.id,
					DeviceId: device.id,
				})

				void reRenderPage()
			} else return ErrorException('Session not exist')
		}

		setIsLoading(true)
		await notificationsHandler({
			fx: main,
			id: 'changeItemRate',
			notificationTitle: 'Rating status:',
			pendingMessage: 'Sending...',
			fulfilledMessage: 'Added successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
			silent: true,
		}).finally(() => setIsLoading(false))
	}

	useEffect((): void => {
		if (!device && status !== 'loading') void reRenderPage()
	}, [device, session, status])

	if (!device) return <ProductsLoader />

	const url: string = (process.env.NEXT_PUBLIC_API_URL as string) + device.img

	return (
		<Container fluid size={'md'} pt={20}>
			<Flex direction={'column'} justify={'center'} align={'center'}>
				<Title order={2}>Product page: {device.id}</Title>
				<Box mt={20} style={{ width: '220px', height: '220px', position: 'relative', borderRadius: '5px', overflow: 'hidden' }}>
					<Image quality={100} placeholder={'blur'} src={url} blurDataURL={url} layout={'fill'} loading={'lazy'} alt={''} />
				</Box>
				<Box pt={12} w={220}>
					<Text fw={500}>{device.name}</Text>
					<Text fw={500}>Category: {device.Category.name}</Text>
					<Text fw={500}>Brand: {device.Brand.name}</Text>
					<Text fw={500}>Price: {device.price}$</Text>
					<Text fw={500}>Title: {device.DeviceInfo.title}</Text>
					<Text fw={500}>Description: {device.DeviceInfo.description}</Text>
					<Flex direction={'row'} justify={'center'} align={'center'}>
						<Box h={25}>
							<Center>
								{!isLoading && status === 'authenticated' && (
									<>
										<Rating onChange={changeItemRate} value={value} count={5} color={'blue'} />
										<Text ml={5} fw={500}>
											{Math.round(device.rating * 10) / 10}
										</Text>
									</>
								)}

								{!isLoading && status === 'unauthenticated' && (
									<>
										<Rating value={Math.round(value * 10) / 10} count={5} fractions={10} readOnly />
										<Text ml={5} fw={500}>
											{Math.round(device.rating * 10) / 10}
										</Text>
									</>
								)}
							</Center>

							{isLoading && <Loader pt={6} size={'lg'} variant={'dots'} />}
						</Box>
					</Flex>
				</Box>
				{session && (
					<Group pt={12} w={220} position={'center'}>
						<Button w={48} radius={'md'} color={'grape'} variant={'light'} onClick={handlers.increment}>
							+
						</Button>
						<Input
							w={90}
							value={count}
							variant={'filled'}
							onChange={(e: ChangeEvent<HTMLInputElement>) => handlers.set(+e.target.value)}
							type={'number'}
							placeholder={'Count'}
						/>
						<Button w={48} radius={'md'} color={'grape'} variant={'light'} onClick={handlers.decrement}>
							-
						</Button>
					</Group>
				)}
				<Group pt={12} w={220} position={'center'} noWrap={true}>
					{session && (
						<Button fullWidth onClick={sendData} disabled={!device} radius={'md'} color={'teal'} variant={'light'}>
							Add to cart
						</Button>
					)}

					<Button fullWidth radius={'md'} color={'red'} variant={'light'} onClick={() => push('/products')}>
						Go back
					</Button>
				</Group>
			</Flex>
		</Container>
	)
}
