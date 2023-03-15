import classNames from 'classnames'
import React, { ButtonHTMLAttributes } from 'react'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    type?: 'submit' | 'reset' | 'button' | undefined
    text?: string,
    variant?:
    "fill"
    | 'outline'
    | 'disable'
    children?: React.ReactNode,
    modifier?: React.HTMLProps<HTMLElement>["className"],
    glowEffect?: boolean,
    glowModify?:
    | 'noBg'
    | "noAnimation"
    | "offset",
}

const Button: React.FC<ButtonProps> = ({ type = 'button', text, modifier, children, variant = 'fill', glowEffect = true, glowModify, ...buttonAtt }) => {

    return (
        <button
            {...buttonAtt}
            type={type}
            className={
                classNames(`rounded-lg`,
                    {
                        'flex items-center': children,
                        "noBg border border-priBlue-600": variant === 'outline',
                        'glow-effect': glowEffect,
                    },
                    glowEffect && glowModify ? glowModify : 'offset',
                    modifier ? modifier : 'px-9 py-1',
                )
            }
        >

            {children}

            {text}

            {
                glowEffect &&
                // outline outline-black outline-3
                <svg className='glow-container'>
                    {/* Line-Blur */}
                    <rect rx={8} pathLength="100" strokeLinecap='round' className='glow-blur'></rect>

                    {/* line */}
                    <rect rx={8} pathLength="100" strokeLinecap='round' className='glow-line'></rect>
                </svg>
            }
        </button>
    )
}

export default Button