'use client'
import LoadingHeader from '@/components/Header/LoadingHeader'
import MobileHeader from '@/components/Header/MobileHeader'
import UserPanel from '@/components/Header/UserPanel'
import { Box, Burger, Group, Header, createStyles, rem, useDisclosure } from '@/components/clientWrapper'
import { MantineLogo } from '@mantine/ds'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const useStyles = createStyles((theme) => ({
	link: {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontWeight: 500,
		fontSize: theme.fontSizes.sm,

		[theme.fn.smallerThan('sm')]: {
			height: rem(42),
			display: 'flex',
			alignItems: 'center',
			width: '100%',
		},

		...theme.fn.hover({
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		}),
	},

	subLink: {
		width: '100%',
		padding: `${theme.spacing.xs} ${theme.spacing.md}`,
		borderRadius: theme.radius.md,

		...theme.fn.hover({
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
		}),

		'&:active': theme.activeStyles,
	},

	dropdownFooter: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
		margin: `calc(${theme.spacing.md} * -1)`,
		marginTop: theme.spacing.sm,
		padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
		paddingBottom: theme.spacing.xl,
		borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]}`,
	},

	hiddenMobile: {
		[theme.fn.smallerThan('sm')]: {
			display: 'none',
		},
	},

	hiddenDesktop: {
		[theme.fn.largerThan('sm')]: {
			display: 'none',
		},
	},
}))

export default function MainHeader() {
	const { classes, theme } = useStyles()
	const { push } = useRouter()
	const { data: session, status } = useSession({ required: false })
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

	if (status === 'loading') return <LoadingHeader classes={classes} drawerOpened={drawerOpened} toggleDrawer={toggleDrawer} />

	return (
		<Box>
			<Header height={60} px='md'>
				<Group position='apart' sx={{ height: '100%' }}>
					<MantineLogo cursor={'pointer'} onClick={() => push('/')} size={30} />

					<Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
						<Link href={'/'} className={classes.link}>
							Home
						</Link>
						<Link href={'/products'} className={classes.link}>
							Products
						</Link>
						{status === 'authenticated' && (
							<>
								<Link href={'/userPage'} className={classes.link}>
									User
								</Link>
								<Link href={'/cartPage'} className={classes.link}>
									Cart
								</Link>
							</>
						)}
						{status === 'authenticated' && session.user.role === 'ADMIN' && (
							<Link href={'/adminPage'} className={classes.link}>
								Admin
							</Link>
						)}
					</Group>

					<Group spacing={0} className={classes.hiddenMobile}>
						<UserPanel session={session!} status={status} />
					</Group>

					<Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
				</Group>
			</Header>

			<MobileHeader
				status={status}
				role={session?.user.role}
				classes={classes}
				drawerOpened={drawerOpened}
				closeDrawer={closeDrawer}
				theme={theme}
			/>
		</Box>
	)
}
