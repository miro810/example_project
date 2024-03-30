'use client'
import { Avatar, Button, Container, Flex, Tooltip } from '@/components/clientWrapper'
import { useSignOutModal } from '@/store'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { shallow } from 'zustand/shallow'

interface IProps {
	session: Session
	status: 'authenticated' | 'unauthenticated'
}

export default function UserPanel({ session, status }: IProps) {
	const { push } = useRouter()
	const [open] = useSignOutModal((state) => [state.open], shallow)

	return (
		<>
			<Container fluid size={'xs'}>
				<Flex gap='md' justify='flex-end' align='center' direction='row'>
					{status === 'authenticated' && (
						<Button w={94} radius={'md'} onClick={open}>
							Sign Out
						</Button>
					)}

					{status === 'unauthenticated' && (
						<>
							<Button w={94} radius={'md'} onClick={() => push('/signUp')} variant={'filled'}>
								Sign Up
							</Button>
							<Button w={94} radius={'md'} onClick={() => push('/signIn')} variant={'filled'}>
								Sign In
							</Button>
						</>
					)}
				</Flex>
			</Container>
			{session?.user.email && (
				<Tooltip label={session.user.email} withArrow>
					<Avatar radius={'xl'} src={process.env.NEXT_PUBLIC_API_URL + session.user.img} />
				</Tooltip>
			)}
			{!session?.user.email && <Avatar radius={'xl'} />}
		</>
	)
}
