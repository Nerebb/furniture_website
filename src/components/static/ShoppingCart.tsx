import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { Dialog } from '@headlessui/react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import Loading from './Loading'
import ShoppingItem from './ShoppingItem'

type Props = {
  modifier?: string,
  btnText?: boolean
  keepOpen?: boolean
  fetchData?: boolean
}

export default function ShoppingCart({ keepOpen = false, btnText, modifier, fetchData = false }: Props) {
  const [fetching, setFetching] = useState<boolean>(fetchData)
  const router = useRouter()

  const { data: Cart, isLoading, isError, isFetching } = useQuery({
    queryKey: ['ShoppingCart'],
    queryFn: () => axios.getShoppingCart(),
    enabled: fetching
  })

  const subTotal = Cart?.subTotal ? fCurrency(parseInt(Cart?.subTotal)) : "None"
  return (
    <Modal
      type='translateX'
      btnProps={{
        text: btnText ? 'Shopping cart' : undefined,
        variant: 'plain',
        glowEffect: false,
        modifier: modifier ? modifier : 'none',
        children: <ShoppingCartIcon className='w-6 h-6' />
      }}
      onClick={() => setFetching(true)}
      keepOpen={keepOpen}
    >
      <Dialog.Panel
        as="div"
        className="max-w-xs md:max-w-2xl w-screen h-screen transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all flex flex-col overflow-y-auto customScrollbar dark:bg-priBlack-700"
      >
        {/* Title */}
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 p-5 border-b border-priBlack-200/50 dark:divide-priBlack-50 dark:text-white"
        >
          Shopping Cart
        </Dialog.Title>

        {/* UserCart */}
        <article className='px-5 divide-y divide-priBlack-200/50 dark:divide-priBlack-50 dark:text-white'>
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
        </article>
        <div className='grow'></div>

        {/* subTotal */}
        <div
          className='sticky bottom-0 p-5 border-t border-priBlack-200/50 bg-white space-y-5 dark:bg-priBlack-700'
        >
          <div>
            <div className='font-semibold flex justify-between dark:text-white'>
              <p>Subtotal</p>
              {isFetching ? (
                <Loading className='w-6 h-6 text-priBlack-200/50 dark:text-white fill-priBlue-500' />
              ) : (
                <p >{subTotal}</p>
              )}
            </div>
            <p className='text-gray-500 dark:text-priBlack-100'>Shipping and taxes calculated at checkout.</p>
          </div>
          <div className='flex-center w-full px-5'>
            <Button text='Checkout' modifier='w-full py-4 text-white' onClick={() => router.push('/checkout')} />
          </div>
        </div>
      </Dialog.Panel>
    </Modal>
  )
}