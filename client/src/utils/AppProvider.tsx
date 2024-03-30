'use client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { EmotionCache, MantineProvider } from '@mantine/core'
import { SessionProvider } from 'next-auth/react'
import { useServerInsertedHTML } from 'next/navigation'
import React, { useState } from 'react'

const useGluedEmotionCache = (key: string = 'emotion') => {
	const [cache] = useState<EmotionCache>(() => {
		const cache: EmotionCache = createCache({ key })
		cache.compat = true
		return cache
	})

	useServerInsertedHTML((): null | React.ReactNode => {
		const entries: [string, string | true][] = Object.entries(cache.inserted)
		if (!entries.length) return null
		const names: string = entries
			.map(([n]) => n)
			.filter((ignore: string): boolean => true)
			.join(' ')
		const styles: string = entries.map(([, s]) => s).join('\n')
		const emotionKey: string = `${key} ${names}`
		return <style data-emotion={emotionKey} dangerouslySetInnerHTML={{ __html: styles }} />
	})

	return cache
}

interface ProviderPros {
	children: React.ReactNode
}

export default function AppProvider({ children }: ProviderPros) {
	const cache: EmotionCache = useGluedEmotionCache()

	return (
		<CacheProvider value={cache}>
			<SessionProvider>
				<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }} emotionCache={cache}>
					{children}
				</MantineProvider>
			</SessionProvider>
		</CacheProvider>
	)
}
