import Chip from '@/components/Chip'
import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { ResponseOrder } from '@/pages/api/order'
import { useQuery } from '@tanstack/react-query'
import { GetColorName } from 'hex-color-to-color-name'
import React from 'react'
import Loading from '../../Loading'
import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import useBrowserWidth from '@/hooks/useBrowserWidth'

type Props = {
    orderId: string
    fetchDetail: boolean
}

export default function OrderDetail({ orderId, fetchDetail }: Props) {
    const { theme } = useTheme()
    const browserWidth = useBrowserWidth()
    const { data: order, isLoading, isError } = useQuery({
        queryKey: ['orderedProducts', orderId],
        queryFn: () => axios.getOrderedProducts(orderId),
        enabled: fetchDetail
    })

    if (isError) return <>ORDER DETAIL NOT FOUND</>

    if (isLoading && fetchDetail) return (
        <div className='h-full w-full flex-center'>
            <Loading />
        </div>
    )

    return (
        <div className='space-y-1.5 overflow-x-hidden overflow-y-auto customScrollbar transform transition duration-300 max-h-[200px]'>
            <table className={classNames('w-full',
                { 'hidden': !fetchDetail }
            )}>
                {/* Header */}
                <thead>
                    <tr className='border-b'>
                        <th className='text-left'>Item name</th>
                        {browserWidth > 640 && <th className='text-center'>Color</th>}
                        {browserWidth > 1280 && <th className='text-center whitespace-nowrap'>Sale Price</th>}
                        <th className='text-right'>Quantities</th>
                        <th className='text-right whitespace-nowrap'>SubTotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.orderedProductDetail && order.orderedProductDetail.map((product, idx) => (
                        <tr key={`${order.id}-${idx}`}>
                            <td className='text-left'>
                                {product.name}
                                <p
                                    className='sm:hidden'
                                    style={{ color: `#${product.color === 'fff' && theme === 'light' ? "" : product.color}` }}
                                >
                                    {GetColorName(product.color)}
                                </p>
                            </td>
                            {browserWidth > 640 && <td className='flex-center'>
                                <Chip
                                    modify='px-2 text-base overflow-ellipsis justify-self-end xl:justify-self-center'
                                    color={product.color}
                                    label={GetColorName(product.color)}
                                />
                            </td>}
                            {browserWidth > 1280 && <td className='text-right'>{fCurrency(product.salePrice)}</td>}
                            <td className='text-right'>{product.quantities} (pcs)</td>
                            <td className='text-right'>{fCurrency(product.salePrice * product.quantities)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}