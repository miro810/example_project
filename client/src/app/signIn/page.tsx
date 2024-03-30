'use client'
import { Anchor, Button, Paper, PasswordInput, Text, TextInput, Title, createStyles, notifications, rem } from '@/components/clientWrapper'
import LayoutLoader from '@/utils/LayoutLoader'
import { IconCheck, IconX } from '@tabler/icons-react'
import { SignInResponse, signIn, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import React, { ChangeEvent, SyntheticEvent, useState } from 'react'

interface ISignIn {
	email: string
	password: string
}

const useStyles = createStyles((theme) => ({
	wrapper: {
		minHeight: rem('calc(100vh - 60px)'),
		backgroundSize: 'cover',
		backgroundImage: 'url(/images/signIn.png)',
	},

	form: {
		borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]}`,
		minHeight: rem('calc(100vh - 60px)'),
		maxWidth: rem(440),
		paddingTop: rem(80),

		[theme.fn.smallerThan('sm')]: {
			maxWidth: '100%',
		},
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
	},
}))

export default function Page(): React.ReactNode {
	const { classes } = useStyles()
	const { push } = useRouter()
	const { status } = useSession({ required: false })
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [input, setInput] = useState<ISignIn>({
		email: 'test1@gmail.com',
		password: 'test',
	})

	if (status === 'loading') return <LayoutLoader />
	if (status === 'authenticated') redirect('/userPage')

	const valueChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setInput((prev: ISignIn): ISignIn => ({ ...prev, [name]: value }))
	}

	const submitLogin = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>): Promise<void> => {
		e.preventDefault()
		setIsLoading(true)
		notifications.clean()
		notifications.show({
			id: 'signIn',
			withCloseButton: false,
			title: 'Authorization status:',
			message: 'Loading...',
			loading: true,
			autoClose: false,
		})

		const loginStatus: SignInResponse | void = await signIn('credentials', {
			email: input.email,
			password: input.password,
			redirect: false,
		}).finally(() => setIsLoading(false))

		if (loginStatus && loginStatus.ok && !loginStatus.error) {
			notifications.update({
				id: 'signIn',
				withCloseButton: true,
				title: 'Authorization status:',
				icon: <IconCheck />,
				color: 'teal',
				message: 'Successful',
				autoClose: 4000,
			})
		}

		if (loginStatus && loginStatus.error) {
			notifications.update({
				id: 'signIn',
				withCloseButton: true,
				title: 'Authorization status:',
				icon: <IconX />,
				color: 'red',
				message: `Error: ${loginStatus.error}`,
				autoClose: 2500,
			})
		}
	}

	return (
		<div className={classes.wrapper}>
			<Paper className={classes.form} radius={0} p={30}>
				<Title order={2} className={classes.title} ta='center' mt='md' mb={50}>
					Welcome back!
				</Title>

				<form onSubmit={submitLogin}>
					<TextInput
						withAsterisk
						required
						size={'md'}
						autoComplete={'true'}
						label={'Email:'}
						placeholder={'Email: test1@gmail.com'}
						name={'email'}
						value={input.email}
						onChange={valueChange}
						disabled={isLoading}
					/>

					<PasswordInput
						withAsterisk
						required
						size={'md'}
						autoComplete={'true'}
						label={'Password:'}
						placeholder={'Password: test'}
						name={'password'}
						value={input.password}
						onChange={valueChange}
						disabled={isLoading}
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
						Sign In
					</Button>
				</form>

				<Text ta='center' mt='md'>
					Don&apos;t have an account?{' '}
					<Anchor<'a'>
						href=''
						weight={700}
						onClick={(e) => {
							e.preventDefault()
							push('/signUp')
						}}
					>
						Register
					</Anchor>
				</Text>
			</Paper>
		</div>
	)
}
