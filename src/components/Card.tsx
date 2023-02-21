import classNames from 'classnames'
import React from 'react'

type Props = {
    modify: string,
    children: React.ReactNode
}

function Card({ modify, children }: Props) {
    return (
        <div className={classNames(
            'rounded-3xl shadow-lg border-0.5 border-priBlack-100/50',
            modify
        )}>
            {children}
        </div>
    )
}

export default Card