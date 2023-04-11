import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { Dialog } from '@headlessui/react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Button from '../Button'
import Modal from '../Modal'
import Loading from './Loading'
import ShoppingItem from './ShoppingItem'

type Props = {
  keepOpen?: boolean
}

export default function ShoppingCart({ keepOpen = false }: Props) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: Cart, isLoading, isError, isFetching } = useQuery({
    queryKey: ['ShoppingCart'],
    queryFn: () => axios.getShoppingCart()
  })

  const { mutate } = useMutation({
    mutationKey: ['ShoppingCart'],
    mutationFn: (cartItemId: string) => axios.removeShoppingCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const subTotal = Cart?.subTotal ? fCurrency(parseInt(Cart?.subTotal)) : "None"

  function handleRemoveProduct(cartItemId: string) {
    mutate(cartItemId)
  }

  return (
    <Modal
      type='translateX'
      btnProps={{
        variant: 'plain',
        glowEffect: false,
        modifier: 'none',
        children: <ShoppingCartIcon className='w-6 h-6' />
      }}
      keepOpen={keepOpen}
    >
      <Dialog.Panel
        as="div"
        className="max-w-2xl w-screen h-screen transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all flex flex-col overflow-y-auto customScrollbar"
      >
        {/* Title */}
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 p-5 border border-priBlack-200/50"
        >
          Shopping Cart
        </Dialog.Title>

        {/* UserCart */}
        <article className='px-5 divide-y divide-priBlack-200/50'>
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
          className='sticky bottom-0 p-5 border-t border-priBlack-200/50 bg-white space-y-5'
        >
          <div>
            <div className='font-semibold flex justify-between'>
              <p>Subtotal</p>
              {isFetching ? (
                <Loading className='w-6 h-6' />
              ) : (
                <p>{subTotal}</p>
              )}
            </div>
            <p className='text-gray-500'>Shipping and taxes calculated at checkout.</p>
          </div>
          <div className='flex-center w-full'>
            <Button text='Checkout' modifier='px-40 py-4' />
          </div>
        </div>
      </Dialog.Panel>
    </Modal>
  )
}