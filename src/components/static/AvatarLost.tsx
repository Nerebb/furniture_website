import classNames from 'classnames'
import React from 'react'

type Props = {
    height?: number
    width?: number
}

export default function AvatarLost({ height = 14, width = 14 }: Props) {
    return (
        <div className={classNames(
            "relative overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600",
            `w-${width} h-${height}`
        )}>
            <svg
                className={classNames(
                    "absolute text-gray-400 -left-1",
                    `w-${width + 2} h-${height + 2}`
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd">
                </path>
            </svg>
        </div>
    )
}