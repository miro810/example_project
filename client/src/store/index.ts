import type { StoreApi, UseBoundStore } from 'zustand'
import { createWithEqualityFn } from 'zustand/traditional'

type useModal = {
	opened: boolean
	open(): void
	close(): void
}

export const useSignOutModal: UseBoundStore<StoreApi<useModal>> = createWithEqualityFn<useModal>()((set) => ({
	opened: false,
	open: (): void => set({ opened: true }),
	close: (): void => set({ opened: false }),
}))
