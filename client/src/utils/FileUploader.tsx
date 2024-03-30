'use client'
import React, { useRef } from 'react'

interface IFileUploadProps {
	acceptType: string
	children: React.ReactNode
	onChangeInput(e: React.ChangeEvent<HTMLInputElement>): Promise<void> | void
}

export default function FileUploader({ acceptType, children, onChangeInput }: IFileUploadProps) {
	const ref: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null)

	async function selectImage(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
		await onChangeInput(e)
	}

	return (
		<div
			onClick={() => {
				if (ref.current) ref.current.click()
			}}
		>
			<input
				type={'file'}
				accept={acceptType}
				style={{ display: 'none' }}
				ref={ref}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectImage(e)}
			/>
			{children}
		</div>
	)
}
