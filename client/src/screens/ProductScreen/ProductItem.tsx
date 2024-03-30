import { Card, Center, Group, Text } from '@/components/clientWrapper'
import Image from 'next/legacy/image'

interface ICardItem {
	cursor?: 'pointer' | 'default'
	name: string
	price: number
	image: string | File | null | undefined
	onClick?(): void
}

export default function ProductItem({ cursor = 'default', name, price, image, onClick }: ICardItem) {
	const url: string = (process.env.NEXT_PUBLIC_API_URL as string) + image

	return (
		<Card radius={'md'} style={{ cursor: cursor, maxWidth: 252 }} onClick={onClick}>
			<Center pl={16} pr={16}>
				<Card.Section p={16} style={{ width: '220px', height: '220px', position: 'relative' }}>
					<Image quality={100} placeholder={'blur'} src={url} blurDataURL={url} layout={'fill'} loading={'lazy'} alt={''} />
				</Card.Section>
			</Center>

			<Group position={'left'} mt={'xs'}>
				<Text fw={400} weight={252}>
					{name} <br /> Price: {price}$
				</Text>
			</Group>
		</Card>
	)
}
