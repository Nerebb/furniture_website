import { ResponseOrder } from '@/pages/api/order'
import { Status } from '@prisma/client'
import classNames from 'classnames'
import React, { useMemo } from 'react'

type Props = {
    order: ResponseOrder
}

export const statusOrder = [
    { id: Status.pendingPayment, label: 'Pending payment', msg: "Payment type not confirmed", width: '25%', image: '/images/orderPayment.png' },
    { id: Status.processingOrder, label: 'Order confirmation', msg: "User is processing your orders", width: '50%', image: '/images/orderConfirm.png' },
    { id: Status.shipping, label: 'Shipping', msg: "User is shipping your orderId", width: '75%', image: '/images/orderDeliver.png' },
    { id: Status.completed, label: 'Completed', msg: "Thank you for purchased our products", width: '100%', image: '/images/orderComplete.png' },
]

function OrderStatus({ order }: Props) {
    const statusIdx = useMemo(() => {
        const idx = statusOrder.findIndex(i => i.id === order.status)
        if (idx > -1) return idx
        return 0
    }, [order.status])
    return (
        <article className='h-1/3 w-full p-5 flex flex-col justify-between border-t dark:text-gray-400'>
            <dt>{statusOrder[statusIdx].msg}</dt>
            <dt className="relative w-full bg-gray-200 rounded flex dark:bg-priBlack-800">
                <div className="top-0 h-2 rounded shim-blue" style={{ width: `${statusOrder[statusIdx].width}` }}></div>
            </dt>
            <dt className='flex justify-between'>
                {statusOrder.map((i, idx) => (
                    <span key={i.id} className={classNames(
                        "cursor-pointer",
                        { "text-priBlue-500 dark:text-priBlue-200": idx <= statusIdx }
                    )}>
                        {i.label}
                    </span>
                ))}
            </dt>
        </article>
    )
}

export default OrderStatus