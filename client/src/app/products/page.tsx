'use client'
import type { Device, IResponse } from '@/axios/AxiosRequest'
import AxiosRequest from '@/axios/AxiosRequest'
import { Autocomplete, Avatar, Container, Flex, Group, Pagination, SimpleGrid, Text, Title } from '@/components/clientWrapper'
import ProductItem from '@/screens/ProductScreen/ProductItem'
import ProductsLoader from '@/screens/ProductScreen/ProductsLoader'
import useDebounce from '@/utils/useDebounce'
import { IconSearch } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'

interface ItemProps {
	pushId: number
	value: string
	image: string
}

export default function Page() {
	const { push } = useRouter()
	const [products, setProducts] = useState<IResponse<Device> | null>(null)
	const [searchProducts, setSearchProducts] = useState<IResponse<Device> | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [limit, setLimit] = useState<number>(1)
	const [activePage, setActivePage] = useState<number>(1)
	const [value, setValue] = useState<string>('')
	const debounce = useDebounce<string>(async (searchQuery: string): Promise<void> => {
		setSearchProducts(await AxiosRequest.fetchSearchAutoCompleteData(searchQuery))
	}, 500)

	const initLoad = async (e?: number): Promise<void> => {
		try {
			setIsLoading(true)
			const devices: IResponse<Device> = await AxiosRequest.fetchAllProducts(e)
			setLimit(Math.ceil(devices.count / 6))
			setProducts(devices)
		} catch (e) {
			console.log(e)
		} finally {
			setIsLoading(false)
		}
	}

	const searchProductInput = async (searchQuery: string): Promise<void> => {
		setValue(searchQuery)
		debounce(searchQuery)
	}

	useEffect((): void => {
		if (!products) void initLoad()
	}, [products])

	if (isLoading || !products) return <ProductsLoader />

	const data = searchProducts?.rows.map((i) => ({
		pushId: i.id,
		value: i.name,
		image: i.img,
	}))

	const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
		({ pushId, value, image, ...others }: ItemProps, ref: ForwardedRef<HTMLDivElement>) => (
			<div ref={ref} {...others}>
				<Group noWrap>
					<Avatar src={process.env.NEXT_PUBLIC_API_URL + image} />
					<Text fw={500}>{value}</Text>
				</Group>
			</div>
		),
	)

	return (
		<Container fluid size={'md'} pt={20}>
			<Flex direction={'column'} justify={'center'} align={'center'}>
				<Autocomplete
					icon={<IconSearch />}
					maxDropdownHeight={220}
					dropdownPosition={'bottom'}
					placeholder={'Search product'}
					onChange={searchProductInput}
					onItemSubmit={(e) => push(`/products/item/${e.pushId.toString()}`)}
					style={{ width: '90%', minWidth: 252, maxWidth: 790 }}
					itemComponent={AutoCompleteItem}
					data={value.length > 0 && data ? data : []}
					transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
				/>

				{products && products.count > 0 && (
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
						{products.rows.map((item: Device) => (
							<ProductItem
								onClick={() => push(`/products/item/${item.id.toString()}`)}
								cursor={'pointer'}
								name={item.name}
								price={item.price}
								image={item.img}
								key={item.id}
							/>
						))}
					</SimpleGrid>
				)}

				{products && products.count === 0 && <Title pt={20}>Add products</Title>}

				{products && products.count !== 0 && (
					<Pagination
						pt={20}
						total={limit}
						defaultValue={activePage}
						onChange={(e): void => {
							setActivePage(e)
							void initLoad(e)
						}}
						siblings={1}
						boundaries={1}
						withControls={false}
						mb={20}
					/>
				)}
			</Flex>
		</Container>
	)
}
