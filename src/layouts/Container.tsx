import React from 'react'

type Props = {
    height?: '100vh' | 'h-auto'
    children: React.ReactNode
}

function Container({ height, children }: Props) {
    return (
        <main
            className={`max-w-screen-mobile md:max-w-screen-tablet xl:px-5 xl:max-w-screen-desktop w-full min-h-screen mx-auto flex flex-col ${height}`}
        >
            {children}
        </main>
    )
}

export default Container