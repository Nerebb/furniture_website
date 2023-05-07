import Button from '@/components/Button'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import axios from '@/libs/axiosApi'
import bigIntStringToNumber from '@/libs/utils/bigIntStringToNumber'
import { fCurrency } from '@/libs/utils/numberal'
import { ResponseOrder } from '@/pages/api/order'
import { Transition } from '@headlessui/react'
import { Status } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ImageLost from '../../ImageLost'
import Loading from '../../Loading'
import OrderDropMenu from './OrderDropMenu'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import dateFormat from '@/libs/utils/dateFormat'

type Props = {
    order: ResponseOrder
    productStatus?: boolean
    isLoading?: boolean
}

const status = [
    { id: Status.pendingPayment, label: 'Pending payment', msg: "Payment type not confirmed", width: '25%', image: '/images/orderPayment.png' },
    { id: Status.processingOrder, label: 'Order confirmation', msg: "User is processing your orders", width: '50%', image: '/images/orderConfirm.png' },
    { id: Status.shipping, label: 'Shipping', msg: "User is shipping your orderId", width: '75%', image: '/images/orderDeliver.png' },
    { id: Status.completed, label: 'Completed', msg: "Thank you for purchased our products", width: '100%', image: '/images/orderComplete.png' },
]

export default function OrderProduct({ order, isLoading = true, productStatus = true }: Props) {
    const [loadMore, setLoadMore] = useState<boolean>(false)
    const browserWidth = useBrowserWidth()
    if (browserWidth < 768) productStatus = false

    const { mutate: cancelOrder } = useMutation({
        mutationKey: ['OrderProduct'],
        mutationFn: () => axios.cancelUserOrder(order.id),
        onSuccess: (data) => toast.success(data.message),
        onError: (error: any) => toast.error(error)
    })

    const statusIdx = useMemo(() => {
        const idx = status.findIndex(i => i.id === order.status)
        if (idx > -1) return idx
        return 0
    }, [order.status])

    const { data: orderedProducts, isLoading: orderedIsLoading, isError } = useQuery({
        queryKey: ['orderedProducts', order.id],
        queryFn: () => axios.getOrderedProducts(order.id),
        enabled: loadMore
    })

    const cancelButton = useMemo(() => {
        if (
            order.status === 'completed'
            || order.status === 'orderCanceled'
            || order.status === 'shipping'
        ) return false
        return true
    }, [order.status])

    const handleCancelOrder = () => {
        cancelOrder()
    }

    if (isError) toast.error("Cannot get products of current order - please try again")

    return (
        <Card modify={classNames(
            'relative group hover:border-priBlue-500 hover:border-1 bg-white dark:bg-priBlack-600',
            productStatus ? 'h-[400px]' : browserWidth < 428 ? 'h-full' : 'h-[300px]',
            'flex flex-col'
        )}>
            {isLoading &&
                <div className='h-full flex-center'>
                    <Loading />
                </div>
            }

            {order &&
                <>
                    {/* DropMenu */}
                    <div className='hidden right-3 top-2.5 group-hover:block group-hover:absolute z-40'>
                        <OrderDropMenu
                            orderId={order.id}
                            setLoadMore={setLoadMore}
                            disable={cancelButton}
                        />
                    </div>

                    <dl className={classNames(
                        'flex flex-col md:flex-row sm:space-x-5 p-5',
                        productStatus ? 'h-2/3' : 'h-full'
                    )}>
                        {/* Images */}
                        <dt className='relative aspect-square rounded-xl order-1'>
                            {order.status ? (
                                <Image width={300} height={300} alt='' className='h-full rounded-xl absolute object-cover' src={status[statusIdx].image} />
                            ) : (
                                <ImageLost />
                            )}
                        </dt>

                        {/* Product */}
                        <aside className='sm:grow-4 flex flex-col space-y-3 order-3 md:order-2'>
                            <dt>
                                <h1 className='font-semibold dark:text-white'>OrdersID</h1>
                                <p className='text-gray-500 dark:text-gray-400'> {order.id}</p>
                            </dt>
                            <Transition
                                as='div'
                                show={loadMore}
                                className='space-y-1.5 overflow-x-hidden overflow-y-auto customScrollbar'
                                enter='transform transition duration-300'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                {orderedIsLoading &&
                                    <div className='h-full w-full flex-center'>
                                        <Loading />
                                    </div>
                                }
                                {orderedProducts?.orderedProductDetail && orderedProducts.orderedProductDetail.map(product => (
                                    <div
                                        key={product.id}
                                        className='grid grid-cols-2'
                                    >
                                        <div className='w-full grid grid-cols-2 col-span-2 xl:col-span-1 mr-2 sm:mr-0'>
                                            <p
                                                className='font-semibold first-letter:capitalize dark:text-gray-200'
                                            >
                                                {product.name}
                                            </p>
                                            <Chip
                                                modify='w-[80px] text-base justify-self-end xl:justify-self-center md:w-[65px]'
                                                color={product.color}
                                                label={GetColorName(product.color)}
                                            />
                                        </div>
                                        <div className='w-full grid grid-cols-5 sm:grid-cols-4 col-span-2 xl:col-span-1'>
                                            <div
                                                className='font-semibold first-letter:capitalize dark:text-gray-400 justify-self-start whitespace-nowrap col-span-2 sm:col-span-1'
                                            >
                                                <p>{fCurrency(product.salePrice)}</p>
                                            </div>
                                            <p
                                                className='font-semibold first-letter:capitalize dark:text-gray-400 justify-self-center whitespace-nowrap col-span-1'
                                            >
                                                {product.quantities} (pcs)
                                            </p>
                                            <p
                                                className='justify-self-end sm:mr-2 whitespace-nowrap dark:text-gray-200 col-span-2'
                                            >
                                                <span className='hidden xl:inline-block'>SubTotal: </span>
                                                <span className='text-priBlue-600 dark:text-gray-200 '>{fCurrency(product.salePrice * product.quantities)}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </Transition>

                            <Transition
                                as='div'
                                className={'grow flex flex-col'}
                                show={!loadMore}
                                leave='transform transition duration-300'
                                leaveFrom='opacity-100'
                                leaveTo='opacity-0'
                            >
                                <dt className='font-semibold dark:text-white'>Sumary</dt>
                                <dd className='text-gray-500 dark:text-gray-400'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                                <dd className='grow'></dd>

                                <dd className='flex space-x-5 mt-2 sm:mt-0'>
                                    <Button
                                        text='More detail'
                                        modifier='h-[40px] w-[120px] dark:text-white'
                                        glowModify='noAnimation'
                                        onClick={() => setLoadMore(true)}
                                    />
                                    {cancelButton && <Button
                                        text={'Cancel Order'}
                                        variant='outline'
                                        modifier='h-[40px] w-[120px] dark:text-white'
                                        glowModify='noAnimation'
                                        onClick={handleCancelOrder}
                                    />}
                                </dd>
                            </Transition>
                        </aside>


                        {/* OrderInfo */}
                        {!loadMore && <aside className='grow max-w-[250px] sm:max-w-[150px] xl:max-w-[250px] break-words space-y-2 order-2 md:order-3'>
                            <div>
                                <dt className='font-semibold dark:text-white'>ShippingID:</dt>
                                <dd className='text-gray-500 dark:text-gray-400'>{order.shippingAddress}</dd>
                            </div>

                            <div>
                                <dt className='font-semibold dark:text-white'>Status</dt>
                                <dd className='text-gray-500 dark:text-gray-400'>{order.status}</dd>
                            </div>

                            <div>
                                <dt className='font-semibold dark:text-white'>DateTime</dt>
                                <dd className='text-gray-500 dark:text-gray-400'>Created date: {dateFormat(order.createdDate)}</dd>
                                <dd className='text-gray-500 dark:text-gray-400'>Updated date: {dateFormat(order.updatedAt)}</dd>
                            </div>

                            <Transition
                                as='div'
                                show={loadMore}
                                enter='transform transition duration-300'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                            >
                                <dt className='font-semibold dark:text-white'>Sumary</dt>
                                <dd className='text-gray-500 dark:text-gray-400'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                            </Transition>
                        </aside>}
                    </dl>

                    {/* Status */}
                    {productStatus && <article className='h-1/3 w-full p-5 flex flex-col justify-between border-t dark:text-gray-400'>
                        <dt>{status[statusIdx].msg}</dt>
                        <dt className="relative w-full bg-gray-200 rounded flex dark:bg-priBlack-800">
                            <div className="top-0 h-2 rounded shim-blue" style={{ width: `${status[statusIdx].width}` }}></div>
                        </dt>
                        <dt className='flex justify-between'>
                            {status.map((i, idx) => (
                                <span key={i.id} className={classNames(
                                    "cursor-pointer",
                                    { "text-priBlue-500 dark:text-priBlue-200": idx <= statusIdx }
                                )}>
                                    {i.label}
                                </span>
                            ))}
                        </dt>
                    </article>}
                </>
            }
        </Card >
    )
}