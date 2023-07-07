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
import OrderStatus, { statusOrder } from './OrderStatus'
import OrderDetail from './OrderDetail'

type Props = {
    order: ResponseOrder
    productStatus?: boolean
    isLoading?: boolean
}

export default function OrderCard({ order, isLoading = true, productStatus = true }: Props) {
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
        const idx = statusOrder.findIndex(i => i.id === order.status)
        if (idx > -1) return idx
        return 0
    }, [order.status])

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

    return (
        <Card modify={classNames(
            'relative group hover:border-priBlue-500 hover:border-1 bg-white dark:bg-priBlack-600',
            productStatus ? 'h-[400px]' : browserWidth < 765 ? 'h-[645px]' : 'h-[300px]',
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
                                <Image width={300} height={300} alt='' className='h-full rounded-xl absolute object-cover' src={statusOrder[statusIdx].image} />
                            ) : (
                                <ImageLost />
                            )}
                        </dt>

                        {/* Ordered products */}
                        <aside className='sm:grow-4 flex flex-col space-y-3 order-3 md:order-2'>
                            <dt>
                                <h1 className='font-semibold dark:text-white'>OrdersID</h1>
                                <p className='text-gray-500 dark:text-gray-400'> {order.id}</p>
                            </dt>

                            {/* Order Detail*/}
                            <OrderDetail orderId={order.id} fetchDetail={loadMore} />

                            <div className={classNames(
                                'grow flex flex-col transform transition duration-300',
                                { 'hidden': loadMore }
                            )}>
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
                            </div>
                        </aside>

                        {/* OrderInfo */}
                        {!loadMore &&
                            <aside className='grow max-w-[250px] sm:max-w-[150px] xl:max-w-[250px] break-words space-y-2 order-2 md:order-3'>
                                <div>
                                    <dt className='font-semibold dark:text-white'>ShippingID:</dt>
                                    <dd className='text-gray-500 dark:text-gray-400'>{order.shippingAddress}</dd>
                                </div>

                                <div>
                                    <dt className='font-semibold dark:text-white'>Status</dt>
                                    <dd className='text-gray-500 dark:text-gray-400'>{order.status}</dd>
                                </div>

                                {browserWidth > 1024 && <div>
                                    <dt className='font-semibold dark:text-white'>DateTime</dt>
                                    <dd className='text-gray-500 dark:text-gray-400'>Created date: {dateFormat(order.createdDate)}</dd>
                                    <dd className='text-gray-500 dark:text-gray-400'>Updated date: {dateFormat(order.updatedAt)}</dd>
                                </div>}

                                <div className={classNames(
                                    'transform transition duration-300',
                                    { 'hidden': !loadMore }
                                )}>
                                    <dt className='font-semibold dark:text-white'>Sumary</dt>
                                    <dd className='text-gray-500 dark:text-gray-400'>Total: {fCurrency(bigIntStringToNumber(order.total))}</dd>
                                </div>
                            </aside>
                        }
                    </dl>

                    {/* Status */}
                    {productStatus && <OrderStatus order={order} />}
                </>
            }
        </Card >
    )
}