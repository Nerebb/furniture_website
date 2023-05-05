import classNames from 'classnames'
import React from 'react'

type Props = {
    modify?: string,
    type?:
    | 'default'
    | 'SearchCard'
    children: React.ReactNode
}

function Card({ type = 'default', modify, children }: Props) {
    return (
        <div className={classNames(
            {
                'rounded-3xl shadow-lg border-0.5 border-priBlack-100/50': type === 'default',
                'pb-2 shadow-sm border-0.5 rounded-2xl p-5 pt-3 group hover:border-priBlue-500 dark:bg-priBlack-500 dark:border-black dark:hover:border-white': type === 'SearchCard',
            },
            modify
        )}>
            {children}
        </div>
    )
}

export default Card