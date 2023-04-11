import React from 'react'
import Card from '../../Card'
import Loading from '../Loading'
import ShoppingItem from '../ShoppingItem'
import { useRouter } from 'next/router'
import axios from '@/libs/axiosApi'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Button from '../../Button'
import { fCurrency } from '@/libs/utils/numberal'

type Props = {}

export const defaultShippingPrice = 20000

export default function CheckoutItem({ }: Props) {
    const router = useRouter()
    const { data: Cart, isLoading, isError, isFetching } = useQuery({
        queryKey: ['ShoppingCart'],
        queryFn: () => axios.getShoppingCart()
    })

    const subTotal = Cart?.subTotal ? fCurrency(parseInt(Cart?.subTotal)) : "None"
    const shippingPrice = fCurrency(defaultShippingPrice)
    const total = fCurrency(parseInt(Cart?.subTotal ?? "0") + defaultShippingPrice)

    if (isError) toast.error("ShoppingCart not found")

    return (
        <Card
            modify='px-5 divide-y divide-priBlack-200/50'
        >
            {isLoading &&
                <div className='flex-center mt-5'>
                    <Loading />
                </div>
            }
            {Cart && Cart.shoppingCartItem ? Cart.shoppingCartItem.map(product => (
                <ShoppingItem key={product.id} {...product} />
            )) : !isLoading && (
                <div className='w-full text-center mt-5'>
                    <h1 className='text-xl'>No product found</h1>
                    <button
                        className='underline text-priBlue-500'
                        onClick={() => router.push('/products')}
                    >
                        Continue shopping
                    </button>
                </div>
            )}

            <div className='grow'></div>

            {/* Total */}
            <div
                className='sticky bottom-0 p-5 border-t border-priBlack-200/50 bg-white space-y-5'
            >
                <aside className='py-2 space-y-2'>
                    <div className='text-gray-500 flex justify-between'>
                        <p>Subtotal</p>
                        {isFetching ? (
                            <Loading className='w-6 h-6 text-gray-200' />
                        ) : (
                            <p>{subTotal}</p>
                        )}
                    </div>
                    <div className='text-gray-500 flex justify-between'>
                        <p>Shipping</p>
                        <p>{shippingPrice}</p>
                    </div>
                </aside>

                <aside className='font-semibold flex justify-between border-t border-priBlack-200/50'>
                    <p>Total</p>
                    {isFetching ? (
                        <Loading className='w-6 h-6 text-gray-200' />
                    ) : (
                        <p>{total}</p>
                    )}
                </aside>

                <aside className='flex-center w-full'>
                    <Button text='Checkout' modifier='px-40 py-4' />
                </aside>
            </div>
        </Card>
    )
}