import React from 'react'

type Props = {
    height?: '100vh' | 'h-auto'
    children: React.ReactNode
}

function Container({ height, children }: Props) {
    return (
        <main className={`max-w-screen-desktop min-h-screen mx-auto flex flex-col ${height}`}>{children}</main>
    )
}

export default Container