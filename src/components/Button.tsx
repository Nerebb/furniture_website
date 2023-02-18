import classNames from 'classnames'
import React, { useEffect, useMemo, useRef } from 'react'

interface ButtonProps {
    text?: string,
    type?: "button" | "submit" | "reset" | undefined,
    variant?:
    "fill"
    | 'outline'
    | 'disable',
    children?: React.ReactNode,
    modifier?: React.HTMLProps<HTMLElement>["className"],
    glowEffect?: boolean,
    glowModify?:
    | "noOffset"
    | "noOutLine",
    onClick?: () => void,
}

const Button: React.FC<ButtonProps> = ({ type, text, modifier, children, variant = 'fill', glowEffect = true, glowModify, onClick }) => {

    return (
        <button
            // role={glowModify ? glowModify : ""}
            type={type}
            className={
                classNames(`rounded-lg`,
                    {
                        'flex items-center': children,
                        "noBg border border-priBlue-600": variant === 'outline',
                        'glow-effect': glowEffect,
                    },
                    modifier ? modifier : 'px-9 py-1',
                )
            }
            disabled={variant === 'disable' ? true : false}
            onClick={onClick}>
            {children}
            {text}
            {glowEffect &&
                // outline outline-black outline-3
                <svg className='glow-container'>
                    {/* Line-Blur */}
                    <rect rx={8} pathLength="100" strokeLinecap='round' className='glow-blur'></rect>

                    {/* line */}
                    <rect rx={8} pathLength="100" strokeLinecap='round' className='glow-line'></rect>
                </svg>}
        </button>
    )
}

export default Button