import { useState, Fragment } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useCheckoutContext } from '@/contexts/checkoutContext'

type RadioOption = {
    id: number
    value: string
}

type Props = {
    data: RadioOption[]
}

export default function CusRadioGroup({ data }: Props) {
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()
    function handleOnchange(value: number) {
        setCheckoutContext({ ...checkoutContext, checkoutStage: value })
    }
    return (
        <RadioGroup
            as='div'
            value={checkoutContext.checkoutStage}
            onChange={handleOnchange}
            className='flex space-x-2'
        >
            {/* <RadioGroup.Label>Plan</RadioGroup.Label> */}
            {data.map((option, idx) => (
                /* Use the `active` state to conditionally style the active option. */
                /* Use the `checked` state to conditionally style the checked option. */
                <Fragment key={option.id}>
                    <RadioGroup.Option
                        value={option.id}
                        as={Fragment}
                    >
                        {({ active, checked, disabled }) => (
                            <div
                                className={classNames(
                                    "flex-center space-x-1 px-2 py-1 rounded-md cursor-pointer border border-white dark:text-white",
                                    {
                                        "hover:border-priBlack-200/50 dark:hover:border-priBlue-400 dark:hover:text-priBlue-200": !checked,
                                        "bg-priBlue-400 text-white dark:bg-priBlack-400": checked
                                    },
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
                    {idx < (data.length - 1) && (
                        <div className='flex-center'>
                            < ChevronRightIcon className='w-5 h-5' />
                        </div>
                    )}
                </Fragment>
            ))
            }
        </RadioGroup >
    )
}