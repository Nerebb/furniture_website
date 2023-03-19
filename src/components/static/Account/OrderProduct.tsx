import bigIntStringToNumber from '@/libs/utils/bigIntStringToNumber'
import { fCurrency } from '@/libs/utils/numberal'
import { OrderedItem, UserOrder } from '@/pages/api/user/order'
import { Disclosure } from '@headlessui/react'
import { Status } from '@prisma/client'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import { Fragment, useMemo } from 'react'
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
    { id: Status.pendingPayment, label: 'Pending payment', msg: "Payment type not confirmed", width: '25%' },
    { id: Status.processingOrder, label: 'Order confirmation', msg: "User is processing your orders", width: '50%' },
    { id: Status.shipping, label: 'Shipping', msg: "User is shipping your orderId", width: '75%' },
    { id: Status.completed, label: 'Completed', msg: "Thank you for purchased our products", width: '100%' },
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
                            {
                                order.orderedProducts?.map(product => (
                                    <div key={product.id} className="">
                                        {product.imageUrls ? (
                                            <Image fill alt='' className='rounded-xl' src={product.imageUrls[0]} />
                                        ) : (
                                            <ImageLost />
                                        )}
                                    </div>
                                ))
                            }
                        </dt>

                        {/* Product */}
                        <aside className='grow-4 flex flex-col space-y-3'>
                            <div className='overflow-y-auto'>
                                {order.orderedProducts?.map(product => (
                                    <OrderedItems key={product.id} product={product} />
                                ))}
                            </div>

                            <dd className='flex space-x-5'>
                                <Button text='Cancel Order' variant='outline' modifier='py-1 px-2' />
                            </dd>
                        </aside>

                        {/* Total Info */}
                        {/* <aside className='grow whitespace-nowrap'>
                            <dt className='font-semibold'>Sumary</dt>
                            <dd className='text-gray-500'>Subtotal: {fCurrency(bigIntStringToNumber(order.subTotal))}</dd>
                            <dd className='text-gray-500'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                        </aside> */}

                        {/* Address */}
                        <aside className='grow max-w-[250px] break-words'>
                            <dt className='font-semibold'>Address</dt>
                            <dd className='text-gray-500'>Shipping: {order.shippingAddress}</dd>

                            <dt className='font-semibold whitespace-nowrap flex justify-between'>Sumary</dt>
                            <dd className='text-gray-500'>Subtotal: <span>{fCurrency(bigIntStringToNumber(order.subTotal))}</span></dd>
                            <dd className='text-gray-500'>Total: <span>{fCurrency(bigIntStringToNumber(order.total))}</span></dd>
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
        </Card>
    )
}