'use client'
import { Center, Flex, Modal, Text } from '@/components/clientWrapper'
import { useSignOutModal } from '@/store'
import { Button } from '@mantine/core'
import { signOut } from 'next-auth/react'
import { shallow } from 'zustand/shallow'

export default function ModalSignOut() {
	const [opened, close] = useSignOutModal((state) => [state.opened, state.close], shallow)

	const logOut = async (): Promise<void> => await signOut({ redirect: true, callbackUrl: '/' })

	return (
		<Modal keepMounted={true} opened={opened} onClose={close} title={'Sign Out:'}>
			<Center>
				<Text fz={'md'} fw={500}>
					Do you want Log Out of your account?
				</Text>
			</Center>
			<Center>
				<Flex w={222} pt={14} justify={'space-around'} align={'center'}>
					<Button onClick={logOut} w={94} radius={'md'} color={'teal'} variant={'light'}>
						Confirm
					</Button>
					<Button onClick={close} w={94} radius={'md'} color={'red'} variant={'light'}>
						Cancel
					</Button>
				</Flex>
			</Center>
		</Modal>
	)
}
