import type { MantineTheme } from '@/components/clientWrapper'
import { Button, Divider, Drawer, Group, rem, ScrollArea } from '@/components/clientWrapper'
import { useSignOutModal } from '@/store'
import { MantineLogo } from '@mantine/ds'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { shallow } from 'zustand/shallow'

interface IProps {
	status: 'authenticated' | 'unauthenticated'
	role: 'USER' | 'ADMIN' | null
	classes: { link: string; hiddenDesktop: string }
	drawerOpened: boolean

	closeDrawer(): void

	theme: MantineTheme
}

export default function MobileHeader({ status, classes, drawerOpened, closeDrawer, theme, role }: IProps) {
	const { push } = useRouter()
	const [open] = useSignOutModal((state) => [state.open], shallow)

	const changeRoute = (path: string) => {
		push(path)
		closeDrawer()
	}

	return (
		<Drawer
			opened={drawerOpened}
			onClose={closeDrawer}
			size='100%'
			title={<MantineLogo cursor={'pointer'} onClick={() => changeRoute('/')} size={30} />}
			className={classes.hiddenDesktop}
			zIndex={100}
		>
			<ScrollArea h={`calc(100vh - ${rem(80)})`} mx='-md'>
				<Divider my='xs' color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

				<Link href={'/'} onClick={closeDrawer} className={classes.link}>
					Home
				</Link>
				<Link href={'/products'} onClick={closeDrawer} className={classes.link}>
					Products
				</Link>
				{status === 'authenticated' && (
					<>
						<Link href={'/userPage'} onClick={closeDrawer} className={classes.link}>
							User
						</Link>
						<Link href={'/cartPage'} onClick={closeDrawer} className={classes.link}>
							Cart
						</Link>
					</>
				)}
				{status === 'authenticated' && role === 'ADMIN' && (
					<Link href={'/adminPage'} onClick={closeDrawer} className={classes.link}>
						Admin
					</Link>
				)}

				<Divider my='xs' color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />

				<Group position='center' grow pb='xl' px='md'>
					{status === 'authenticated' && (
						<Button fullWidth onClick={open}>
							Sign Out
						</Button>
					)}

					{status === 'unauthenticated' && (
						<>
							<Button radius={'md'} onClick={() => changeRoute('/signUp')} variant={'filled'}>
								Sign Up
							</Button>
							<Button radius={'md'} onClick={() => changeRoute('/signIn')} variant={'filled'}>
								Sign In
							</Button>
						</>
					)}
				</Group>
			</ScrollArea>
		</Drawer>
	)
}
