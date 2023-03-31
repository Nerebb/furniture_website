import { useShoppingCartContext } from '@/contexts/shoppingCartContext'
import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { shoppingCartItem } from '@/pages/api/user/shoppingCart'
import { Dialog } from '@headlessui/react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetColorName } from 'hex-color-to-color-name'
import Image from 'next/image'
import React, { useState } from 'react'
import Button from '../Button'
import Chip from '../Chip'
import Modal from '../Modal'
import ImageLost from './ImageLost'
import Loading from './Loading'
import { StarRating } from './StarRating'

type Props = {
  keepOpen?: boolean
}

function QtyInput({ ...product }: shoppingCartItem) {
  const [itemQty, setItemQty] = useState<number>(product.quantities)

  const [error, setError] = useState<string>()

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationKey: ['ShoppingCart'],
    mutationFn: (newQty: number) => axios.updateShoppingCart(product.id, undefined, newQty),
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  async function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    //Debounce
    const value = parseInt(e.target.value)
    setItemQty(value)
    if (value > product.available) {
      setError("Product stock not meet requirements")
      return
    } else {
      setError(undefined)
      await new Promise(r => setTimeout(r, 2000)); // Debounce
      mutate(value)
    }
  }

  return <label htmlFor={product.id} className="space-x-2">
    <p className='text-red-500 first-letter:capitalize'>{error || ""}</p>
    Qty:
    <input
      id={product.id}
      className="border-none rounded-md focus:outline-none focus:ring-priBlue-500 p-1"
      type='number'
      inputMode="numeric"
      value={itemQty}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e)}
    />
  </label>
}

export default function ShoppingCart({ keepOpen = false }: Props) {
  const queryClient = useQueryClient()
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
          {Cart?.shoppingCartItem && Cart?.shoppingCartItem.map(product => (
            <aside
              key={product.id}
              className='grid grid-cols-4 space-x-5 py-5'
            >
              <div className='w-full relative aspect-square'>
                {product.imageUrl ? (
                  <Image
                    alt=''
                    className='rounded-xl border border-priBlack-200/50'
                    src={product.imageUrl[0]}
                    sizes="(max-width:1000px): 100vw"
                    fill
                  />
                ) : (
                  <ImageLost />
                )}
              </div>
              <div className='col-span-2 flex flex-col'>
                <h1 className='font-semibold first-letter:capitalize'>{product.name}</h1>

                <div>
                  <Chip label={GetColorName(product.color)} color={product.color} />
                </div>

                <div className='flex space-x-2'>
                  <StarRating ProductRating={product.avgRating} />
                  <div className='text-gray-500'>{`(${product.totalRating})`}</div>
                </div>

                <p className='text-gray-500'>OnStock: {product.available}</p>
                <p className='grow'></p>
                <QtyInput {...product} />
              </div>
              <div className='items-end flex flex-col'>
                <h1 className='font-semibold'>{fCurrency(product.price)}</h1>
                <p className='grow'></p>
                <Button text='Remove' variant='outline' glowEffect={false} onClick={() => handleRemoveProduct(product.id)} />
              </div>
            </aside>
          ))}
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