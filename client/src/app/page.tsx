'use client'
import { Button, Container, Flex, Overlay, Text, Title, createStyles, rem } from '@/components/clientWrapper'
import { useRouter } from 'next/navigation'
import React from 'react'

const useStyles = createStyles((theme) => ({
	hero: {
		position: 'relative',
		backgroundImage: 'url(/images/Home.png)',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},

	container: {
		minHeight: rem('calc(100vh - 60px)'),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: `calc(${theme.spacing.xs} * 1)`,
		position: 'relative',
		zIndex: 1,

		[theme.fn.smallerThan('sm')]: {
			minHeight: rem('calc(100vh - 60px)'),
		},
	},

	title: {
		color: theme.white,
		fontSize: rem(45),
		fontWeight: 900,
		lineHeight: 1.1,

		[theme.fn.smallerThan('sm')]: {
			fontSize: rem(30),
			lineHeight: 1.2,
		},

		[theme.fn.smallerThan('xs')]: {
			fontSize: rem(28),
			lineHeight: 1.3,
		},
	},

	description: {
		color: theme.white,
		maxWidth: 600,

		[theme.fn.smallerThan('sm')]: {
			maxWidth: '100%',
			fontSize: theme.fontSizes.sm,
		},
	},

	control: {
		marginTop: `calc(${theme.spacing.xs} * 1.1)`,
		marginBottom: `calc(${theme.spacing.xs} * 1.1)`,

		[theme.fn.smallerThan('sm')]: {
			width: '100%',
		},
	},
}))

export default function Page(): React.ReactNode {
	const { classes } = useStyles()
	const { push } = useRouter()

	return (
		<div className={classes.hero}>
			<Overlay gradient='linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)' opacity={1} zIndex={0} />
			<Container pt={20} className={classes.container}>
				<Flex wrap={'wrap'} direction={'column'} justify={'center'} align={'flex-start'} gap={{ base: 'xs', sm: 'lg' }}>
					<Title className={classes.title}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Title>
					<Text className={classes.description} size='xl' mt='xl'>
						Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
						into electronic typesetting, remaining essentially unchanged.
					</Text>

					<Button variant={'gradient'} size={'lg'} radius={'xl'} className={classes.control} onClick={() => push('/products')}>
						Buy products
					</Button>
				</Flex>
			</Container>
		</div>
	)
}
