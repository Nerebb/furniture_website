import axios from '@/libs/axiosApi';
import { Menu, Transition } from '@headlessui/react';
import { Bars2Icon, XCircleIcon } from '@heroicons/react/24/outline';
import { Status } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { toast } from 'react-toastify';

type Props = {
    orderId: string
    disable: boolean
    setLoadMore: Dispatch<SetStateAction<boolean>>
}

const OrderMenu = [
    {
        id: 0,
        label: "More detail",
    },
    {
        id: 1,
        label: "Cancel order"
    }
] as const

export default function OrderDropMenu({ setLoadMore, orderId, disable }: Props) {
    const queryClient = useQueryClient()
    async function handleOnClick(label: typeof OrderMenu[number]['label']) {
        switch (label) {
            case 'More detail':
                setLoadMore(true)
            case 'Cancel order':
                try {
                    const res = await axios.cancelUserOrder(orderId)
                    toast.success(res.message)
                } catch (error: any) {
                    toast.error(error.message)
                }
        }
    }
    return (
        <div className='text-right'>
            <Menu as="div" className="relative">
                <Menu.Button className={'p-1 flex-center rounded-full flex-center'}>
                    <XCircleIcon width={24} />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className='min-w-[150px] bg-white border divide-y divide-priGray-200/50 rounded-md absolute right-0'>
                        {OrderMenu.map(order => (
                            <Menu.Item key={order.id} disabled={order.label === 'Cancel order' && disable}>
                                {({ active, disabled }) => (
                                    <button
                                        className={classNames(
                                            'first-letter:capitalize w-full flex px-2 py-1.5 space-x-2',
                                            {
                                                'bg-priBlue-200/70': active,
                                                'bg-priBlack-200/50': disabled
                                            }
                                        )}
                                        disabled={order.label === 'Cancel order' && disable}
                                        onClick={() => handleOnClick(order.label)}
                                    >
                                        <p>{order.label}</p>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}