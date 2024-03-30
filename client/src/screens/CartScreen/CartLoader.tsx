import { Card, Center, Loader } from '@/components/clientWrapper'
import React from 'react'

export default function CartLoader(): React.ReactNode {
	return (
		<Card radius={'md'} style={{ maxWidth: 252 }}>
			<Center pl={16} pr={16}>
				<Card.Section p={16} style={{ width: '220px', height: '220px', position: 'relative' }}>
					<Center style={{ height: '100%' }}>
						<Loader size={'xl'} variant={'dots'} />
					</Center>
				</Card.Section>
			</Center>
		</Card>
	)
}
