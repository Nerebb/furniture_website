import React, { PropsWithChildren } from 'react'

type Props = {}

export default function BlankLayout({ children }: PropsWithChildren<Props>) {
    return (
        <main className='overflow-hidden h-screen w-full flex-center'>
            {children}
        </main>
    )
}