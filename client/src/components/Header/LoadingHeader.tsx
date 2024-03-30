'use client'
import { Avatar, Box, Burger, Group, Header, Loader, Skeleton, Tooltip } from '@/components/clientWrapper'
import { MantineLogo } from '@mantine/ds'
import { useRouter } from 'next/navigation'

interface IProps {
	classes: { link: string; hiddenMobile: string; hiddenDesktop: string }
	drawerOpened: boolean
	toggleDrawer(): void
}

export default function LoadingHeader({ classes, drawerOpened, toggleDrawer }: IProps) {
	const { push } = useRouter()

	return (
		<Box>
			<Header height={60} px='md'>
				<Group position='apart' sx={{ height: '100%' }}>
					<MantineLogo cursor={'pointer'} onClick={() => push('/')} size={30} />

					<Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
						<Loader variant={'dots'} />
					</Group>

					<Group className={classes.hiddenMobile}>
						<Box w={236} h={36} component={Skeleton} />
						<Tooltip label='' withArrow>
							<Avatar radius={'xl'} component={Skeleton} />
						</Tooltip>
					</Group>

					<Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
				</Group>
			</Header>
		</Box>
	)
}
