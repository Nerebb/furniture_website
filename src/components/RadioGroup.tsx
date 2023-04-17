import { useState, Fragment } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

type RadioOption = {
    id: number
    value: string
}

type Props = {
    data: RadioOption[]
    initState: number
}

export default function CusRadioGroup({ data, initState }: Props) {
    const [value, setValue] = useState(initState)

    return (
        <RadioGroup
            as='div'
            value={value}
            onChange={setValue}
            className='flex space-x-2'
        >
            {/* <RadioGroup.Label>Plan</RadioGroup.Label> */}
            {data.map((option) => (
                /* Use the `active` state to conditionally style the active option. */
                /* Use the `checked` state to conditionally style the checked option. */
                <RadioGroup.Option
                    key={option.id}
                    value={option.id}
                    as={Fragment}
                >
                    {({ active, checked, disabled }) => (
                        <div
                            className={classNames(
                                "flex space-x-1 px-2 py-1 rounded-md",
                                { "bg-priBlue-400 text-white": checked }
                            )}
                        >
                            {checked && (
                                <div className='flex-center'>
                                    <CheckIcon className='w-5 h-5' />
                                </div>
                            )}
                            <span>{option.value}</span>
                        </div>
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    )
}