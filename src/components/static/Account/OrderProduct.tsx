import bigIntStringToNumber from '@/libs/utils/bigIntStringToNumber'
import { fCurrency } from '@/libs/utils/numberal'
import { OrderedItem, UserOrder } from '@/pages/api/user/order'
import { Disclosure, Transition } from '@headlessui/react'
import { Status } from '@prisma/client'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import { Fragment, useMemo, useState } from 'react'
import Button from '../../Button'
import Card from '../../Card'
import ImageLost from '../ImageLost'
import Loading from '../Loading'

type Props = {
    order?: UserOrder
    productStatus?: boolean
    isLoading?: boolean
}

const status = [
    { id: Status.pendingPayment, label: 'Pending payment', msg: "Payment type not confirmed", width: '25%', image: '/images/orderPayment.png' },
    { id: Status.processingOrder, label: 'Order confirmation', msg: "User is processing your orders", width: '50%', image: '/images/orderConfirm.png' },
    { id: Status.shipping, label: 'Shipping', msg: "User is shipping your orderId", width: '75%', image: '/images/orderDeliver.png' },
    { id: Status.completed, label: 'Completed', msg: "Thank you for purchased our products", width: '100%', image: '/images/orderComplete.png' },
]

function OrderedItems({ product }: { product: OrderedItem }) {
    return (
        <Disclosure>
            <Fragment key={product.id}>
                <Disclosure.Button className='w-full space-x-2 flex justify-between'>
                    <span className='font-semibold first-letter:capitalize'>{product.name}</span>
                    <span className='text-priBlue-600'>{fCurrency(product.salePrice * product.totalQuantities)}</span>
                </Disclosure.Button>
                <Disclosure.Panel className='w-full text-gray-500 space-x-5 flex justify-between'>
                    <div>
                        {product.colors.map(color => (
                            <p key={`text-${color.id}`}><span>{GetColorName(color.id)}: {color.quantities} pcs</span></p>
                        ))}
                    </div>
                    <p className=''>{product.salePrice ? fCurrency(product.salePrice) : "OnUpdating...."} (pcs)</p>
                </Disclosure.Panel>
            </Fragment>
        </Disclosure>
    )
}

export default function OrderProduct({ order, isLoading = true, productStatus = true }: Props) {
    const [loadMore, setLoadMore] = useState<boolean>(false)
    const statusIdx = useMemo(() => {
        const idx = status.findIndex(i => i.id === order?.status)
        if (idx > -1) return idx
        return 0
    }, [order?.status])

    return (
        <Card modify={classNames(
            'divide-y',
            productStatus ? 'h-[400px]' : 'h-[300px]'
        )}>
            {isLoading &&
                <div className='h-full flex-center'>
                    <Loading />
                </div>
            }

            {order &&
                <>
                    <dl className={classNames(
                        'flex space-x-5 p-5',
                        productStatus ? 'h-2/3' : 'h-full'
                    )}>
                        {/* Images */}
                        <dt className='relative aspect-square rounded-xl'>
                            {order.status ? (
                                <Image width={300} height={300} alt='' className='h-full rounded-xl absolute object-cover' src={status[statusIdx].image} />
                            ) : (
                                <ImageLost />
                            )}
                        </dt>

                        {/* Product */}
                        <aside className='grow-4 flex flex-col space-y-3'>
                            <dt>
                                <h1 className='font-semibold'>OrdersID</h1>
                                <p className='text-gray-500'> {order.id}</p>
                            </dt>
                            <Transition
                                as='div'
                                show={loadMore}
                                className='overflow-y-auto customScrollbar'
                                enter='transform transition duration-300'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                {order.orderedProducts?.map(product => (
                                    <OrderedItems key={product.id} product={product} />
                                ))}
                            </Transition>

                            <Transition
                                as='div'
                                show={!loadMore}
                                leave='transform transition duration-300'
                                leaveFrom='opacity-100'
                                leaveTo='opacity-0'
                            >
                                <dt className='font-semibold'>Sumary</dt>
                                <dd className='text-gray-500'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                            </Transition>
                            {!loadMore && <dd className='grow'></dd>}
                            <Transition
                                show={!loadMore}
                                as='div'
                                className='flex space-x-5'
                                leave='transform transition duration-300'
                                leaveFrom='opacity-100'
                                leaveTo='opacity-0'
                            >
                                <Button text='More detail' variant='fill' modifier='py-1 w-[120px]' glowModify='noAnimation' onClick={() => setLoadMore(true)} />
                                <Button text='Cancel Order' variant='outline' modifier='py-1 w-[120px]' glowModify='noAnimation' />
                            </Transition>
                        </aside>


                        {/* OrderInfo */}
                        <aside className='grow max-w-[250px] break-words space-y-2'>
                            <div>
                                <dt className='font-semibold mb'>ShippingID:</dt>
                                <dd className='text-gray-500'>{order.shippingAddress}</dd>
                            </div>

                            <div>
                                <dt className='font-semibold'>DateTime</dt>
                                <dd className='text-gray-500'>Created date: {new Date(order.createdDate).toISOString().substring(0, 10) || "Unknown"}</dd>
                                <dd className='text-gray-500'>Updated date: {new Date(order.updatedAt).toISOString().substring(0, 10) || "Unknown"}</dd>
                            </div>

                            <Transition
                                as='div'
                                show={loadMore}
                                enter='transform transition duration-300'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <dt className='font-semibold'>Sumary</dt>
                                <dd className='text-gray-500'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                            </Transition>
                        </aside>

                        {/* DateTime */}
                        {/* <aside className='grow'>
                            <dt className='font-semibold'>Status</dt>
                            <dd className='text-gray-500'>Created date: {new Date(order.createdDate).toISOString().substring(0, 10) || "Unknown"}</dd>
                            <dd className='text-gray-500'>Updated date: {new Date(order.updatedAt).toISOString().substring(0, 10) || "Unknown"}</dd>
                        </aside> */}
                    </dl>

                    {/* Status */}
                    <article className='h-1/3 w-full p-5 flex flex-col justify-between'>
                        <dt>{status[statusIdx].msg}</dt>
                        <dt className="relative w-full bg-gray-200 rounded flex">
                            <div className="top-0 h-2 rounded shim-blue" style={{ width: `${status[statusIdx].width}` }}></div>
                        </dt>
                        <dt className='flex justify-between'>
                            {status.map((i, idx) => (
                                <span key={i.id} className={classNames(
                                    "cursor-pointer",
                                    { "text-priBlue-500": idx <= statusIdx }
                                )}>{i.label}</span>
                            ))}
                        </dt>
                    </article>
                </>
            }
        </Card >
    )
}