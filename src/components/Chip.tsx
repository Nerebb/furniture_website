import classNames from 'classnames'
import React from 'react'

type Props = {
    type?:
    | 'pill'
    label: string
    color?: string
    modify?: string
    selected?: boolean,
    onClick?: (e: any) => void
}
export default function Chip({ type = 'pill', color, label, onClick, modify, selected = false }: Props) {
    const chipStyle: React.CSSProperties = {
        backgroundColor: color ? `#${color}20` : "#D2E1EE80",
        border: `0.5px solid`,
        borderColor: color ? `#${color}` : "#D2E1EE",
        color: color ? `#${color}` : "#D2E1EE",
        backdropFilter: "blur(4px)"
    }

    const displayLabel = label.match(/[^\s]+/) //Getall letters until first space

    const ChipPills =
        <button
            onClick={onClick}
            className={classNames(
                'rounded-3xl whitespace-nowrap transition-all',
                `hover:ring-2 hover:${color ? `ring-[#${color}]` : 'ring-priBlue-200/50'}`,
                selected ? `ring-2 ${color ? `ring-[#${color}]` : 'ring-priBlue-200/50'}` : "",
                modify ? modify : 'text-xs font-medium mr-2 px-2 py-0.5'
            )}
            style={chipStyle}
        >
            {displayLabel}
        </button>

    switch (type) {
        default:
            return ChipPills
    }
}