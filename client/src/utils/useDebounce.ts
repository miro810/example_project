import type { MutableRefObject } from 'react'
import { useCallback, useRef } from 'react'

export default function useDebounce<T>(fx: Function, delay: number) {
	const timer: MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null)

	return useCallback(
		(...args: T[]): void => {
			if (timer && timer.current) clearTimeout(timer.current)

			timer.current = setTimeout((): void => {
				fx(...args)
			}, delay)
		},
		[fx, delay],
	)
}
