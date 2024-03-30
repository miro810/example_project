import { Center, Container, Loader } from '@/components/clientWrapper'
import React from 'react'

export default function LayoutLoader(): React.ReactNode {
	return (
		<Container fluid size={'xl'} pt={20}>
			<Center style={{ minHeight: '80vh' }}>
				<Loader size='xl' />
			</Center>
		</Container>
	)
}
