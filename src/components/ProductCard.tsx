import Image from 'next/image'
import React from 'react'
import Button from './Button'
import Card from './Card'
import classNames from 'classnames'
import { IProduct } from '@types'

type Props = {
    product?: IProduct
    productStatus?: boolean
}

const status = [
    { id: 0, label: 'Order confirmed', msg: "User is processing your orders" },
    { id: 1, label: 'Order processing', msg: "User is processing your orders" },
    { id: 2, label: 'Shipping', msg: "User is shipping your orders" },
    { id: 3, label: 'Rating', msg: "Please rate and comment to improve our product and have a chance to have awesome gift from us" },
]


export default function ProductCard({ product, productStatus = true }: Props) {
    return (
        <Card modify={classNames(
            'divide-y',
            productStatus ? 'h-[400px]' : 'h-[300px]'
        )}>
            <dl className={classNames(
                'flex space-x-5 p-5',
                productStatus ? 'h-2/3' : 'h-full'
            )}>
                {/* Images */}
                <dt className='relative aspect-square'>
                    <Image fill alt='' className='rounded-xl' src={'/images/OliverSofa_RS.jpg'} />
                </dt>

                {/* Product */}
                <aside className='grow-3 flex flex-col'>
                    <dt className='font-semibold'>ProductName</dt>
                    <dd className='text-gray-500'>Price VND <span>available</span></dd>
                    <dd className='text-gray-500'>color chips</dd>
                    <dd className='text-gray-500'>Description</dd>
                    <dd className='text-gray-500'>Rating</dd>
                    <dd className='flex-grow'></dd>
                    <dd className='flex space-x-5'>
                        {productStatus ? (
                            <>
                                <Button text='Cancel Order' variant='outline' modifier='py-2 px-2' />
                            </>
                        ) : (
                            <>
                                <Button text='Buy now' modifier='py-2 px-8' />
                                <Button text='Remove' variant='outline' modifier='py-2 px-8' />
                            </>
                        )}
                    </dd>
                </aside>

                {/* Address */}
                <aside className='grow'>
                    <dt className='font-semibold'>Address</dt>
                    <dd className='text-gray-500'>User Address</dd>
                </aside>

                {/* Creator */}
                <aside className='grow'>
                    <dt className='font-semibold'>Creator name</dt>
                    <dd className='text-gray-500'>Description</dd>
                </aside>
            </dl>

            {/* Product Status passing ID status of product */}
            {productStatus &&
                <article className='h-1/3 w-full p-5 flex flex-col justify-between'>
                    {status[2].msg && <dt>Status msg</dt>}
                    <dt className="relative w-full bg-gray-200 rounded flex">
                        <div className="top-0 h-2 rounded shim-blue" style={{ width: "75%" }}></div>
                    </dt>
                    <dt className='flex justify-between'>
                        {status.map(i => (
                            <span key={i.id} className={classNames(
                                "cursor-pointer",
                                { "text-priBlue-500": i.id <= 2 }
                            )}>{i.label}</span>
                        ))}
                    </dt>
                </article>}
        </Card>
    )
}