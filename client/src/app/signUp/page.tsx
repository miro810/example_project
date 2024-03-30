'use client'
import ROUTE from '@/axios/AppRoutes'
import { $api } from '@/axios/axiosApi'
import { Button, Container, Paper, PasswordInput, Select, Text, TextInput, Title } from '@/components/clientWrapper'
import LayoutLoader from '@/utils/LayoutLoader'
import notificationsHandler from '@/utils/notificationsHandler'
import { IconCheck, IconX } from '@tabler/icons-react'
import { signIn, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, { ChangeEvent, SyntheticEvent, useState } from 'react'

interface ISignUp {
	email: string
	password: string
}

export default function Page(): React.ReactNode {
	const { status } = useSession({ required: false })
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
	const [input, setInput] = useState<ISignUp>({
		email: 'test1@gmail.com',
		password: 'test',
	})

	if (status === 'loading') return <LayoutLoader />
	if (status === 'authenticated') redirect('/userPage')

	const valueChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setInput((prev: ISignUp): ISignUp => ({ ...prev, [name]: value }))
	}

	const submitRegistration = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>): Promise<void> => {
		e.preventDefault()
		setIsLoading(true)

		async function main(): Promise<void> {
			await $api.post(ROUTE.USER_REGISTRATION, {
				email: input.email,
				password: input.password,
				role: role,
			})
			await signIn('credentials', {
				email: input.email,
				password: input.password,
				role: role,
				redirect: false,
			})
		}

		await notificationsHandler({
			fx: main,
			id: 'signUp',
			notificationTitle: 'Registration status:',
			pendingMessage: 'Uploading...',
			fulfilledMessage: 'Successful',
			fulfilledIcon: <IconCheck />,
			rejectedIcon: <IconX />,
		})
		setIsLoading(false)
	}

	return (
		<Container size={420} my={40}>
			<Title align={'center'} sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
				Welcome back!
			</Title>
			<Text color={'dimmed'} size={'sm'} align={'center'} mt={5}>
				Do not have an account yet?
			</Text>

			<Paper withBorder shadow={'md'} p={30} mt={30} radius={'md'}>
				<form onSubmit={submitRegistration}>
					<Select
						label='User role:'
						defaultValue={role}
						dropdownPosition={'bottom'}
						maxDropdownHeight={280}
						onChange={(e: string | null) => setRole(e as 'USER' | 'ADMIN')}
						name={'role'}
						data={[
							{ value: 'USER', label: 'User' },
							{ value: 'ADMIN', label: 'Admin' },
						]}
					/>

					<TextInput
						label={'Email:'}
						placeholder={'Email: test1@gmail.com'}
						name={'email'}
						value={input.email}
						onChange={valueChange}
						required
						mt={'xl'}
					/>

					<PasswordInput
						label={'Password:'}
						placeholder={'Password: test'}
						name={'password'}
						value={input.password}
						onChange={valueChange}
						required
						mt={'xl'}
					/>

					<Button
						fullWidth
						mt={'xl'}
						size={'md'}
						type={'submit'}
						radius={'md'}
						variant={'filled'}
						disabled={isLoading}
						loading={isLoading}
					>
						Sign Up
					</Button>
				</form>
			</Paper>
		</Container>
	)
}
