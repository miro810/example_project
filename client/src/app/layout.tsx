import { Notifications } from '@/components/clientWrapper'
import MainHeader from '@/components/Header/MainHeader'
import '@/styles/globals.scss'
import AppProvider from '@/utils/AppProvider'
import ModalSignOut from '@/utils/ModalSignOut'
import type { Metadata } from 'next'
import type { NextFont } from 'next/dist/compiled/@next/font'
import { Inter } from 'next/font/google'
import React from 'react'

const inter: NextFont = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Main Title',
	description: 'Description metadata',
	robots: 'Robots metadata',
	keywords: 'Keywords metadata',
	icons: [{ rel: 'icon', url: './favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<AppProvider>
					<Notifications position={'bottom-right'} />
					<ModalSignOut />
					<MainHeader />
					{children}
				</AppProvider>
			</body>
		</html>
	)
}
