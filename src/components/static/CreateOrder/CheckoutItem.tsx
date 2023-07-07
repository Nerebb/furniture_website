import { useCheckoutContext } from '@/contexts/checkoutContext'
import { fCurrency } from '@/libs/utils/numberal'
import { UserShoppingCart } from '@/pages/api/user/shoppingCart'
import { UseQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Card from '../../Card'
import Loading from '../Loading'
import ShoppingItem from '../ShoppingItem'

type Props = {
} & UseQueryResult<UserShoppingCart>

export const defaultShippingPrice = 20000

export default function CheckoutItem({ data: Cart, isLoading, isError, isFetching }: Props) {
    const router = useRouter()
    const { checkoutContext, setCheckoutContext } = useCheckoutContext()

    const subTotal = Cart?.subTotal ? fCurrency(parseInt(Cart?.subTotal)) : "None"
    const shippingPrice = fCurrency(defaultShippingPrice)
    const total = fCurrency(parseInt(Cart?.subTotal ?? "0") + defaultShippingPrice)

    if (checkoutContext.checkoutStage !== 0) return <></>

    return (
        <Card
            modify='flex flex-col px-5 divide-y divide-priBlack-200/50 bg-white dark:bg-priBlack-700'
        >
            <div className='grow max-h-[480px] overflow-y-scroll hideScrollbar'>
                {isLoading &&
                    <div className='h-full flex-center mt-5'>
                        <Loading />
                    </div>
                }
                {Cart && Cart.shoppingCartItem ? Cart.shoppingCartItem.map(product => (
                    <ShoppingItem key={product.id} {...product} />
                )) : !isLoading && (
                    <div className='w-full text-center mt-5 dark:text-white'>
                        <h1 className='text-xl'>No product found</h1>
                        <button
                            className='underline text-priBlue-500'
                            onClick={() => router.push('/products')}
                        >
                            Continue shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Total */}
            <div
                className='p-5 border-t border-priBlack-200/50 bg-white space-y-5 dark:bg-priBlack-700'
            >
                <aside className='py-2 space-y-2'>
                    <div className='text-gray-500 flex justify-between dark:text-white'>
                        <p>Subtotal</p>
                        {isFetching ? (
                            <Loading className='w-6 h-6 text-gray-200 dark:text-white' />
                        ) : (
                            <p>{subTotal}</p>
                        )}
                    </div>
                    <div className='text-gray-500 flex justify-between dark:text-white'>
                        <p>Shipping</p>
                        <p>{shippingPrice}</p>
                    </div>
                </aside>

                <aside className='font-semibold flex justify-between border-t border-priBlack-200/50 pt-5 dark:text-white'>
                    <p>Total</p>
                    {isFetching ? (
                        <Loading className='w-6 h-6 text-gray-200' />
                    ) : (
                        <p>{total}</p>
                    )}
                </aside>
            </div>
        </Card>
    )
}