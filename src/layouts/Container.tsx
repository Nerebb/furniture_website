import React from 'react'

type Props = {
    children: React.ReactNode
}

function Container({ children }: Props) {
    return (
        <main className='max-w-screen-desktop min-h-screen mx-auto flex flex-col'>{children}</main>
    )
}

export default Container