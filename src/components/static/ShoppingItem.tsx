import React, { useState, useMemo } from 'react'
import ImageLost from './ImageLost'
import Image from 'next/image'
import { shoppingCartItem } from '@/pages/api/user/shoppingCart'
import Chip from '../Chip'
import { GetColorName } from 'hex-color-to-color-name'
import { StarRating } from './StarRating'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/libs/axiosApi'
import Button from '../Button'
import { fCurrency } from '@/libs/utils/numberal'
import { Transition } from '@headlessui/react'
import Loading from './Loading'

type Props = shoppingCartItem & {
    type?:
    | 'default'
    | 'checkoutItem'
}

// Input component
function QtyInput({ type, ...product }: Props) {
    const [itemQty, setItemQty] = useState<string | number>(product.quantities)
    const [error, setError] = useState<string>("")
    const value = typeof itemQty !== 'number' ? parseInt(itemQty) : itemQty

    const dirty = value !== product.quantities ? true : false

    const queryClient = useQueryClient()

    const { mutate, isLoading } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: (newQty: number) => axios.updateShoppingCart(product.id, undefined, newQty),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })

    async function handleUpdateQty() {
        if (value > product.available) {
            setError("Product stock not meet requirements")
            return
        } else {
            setError("")
            await new Promise(r => setTimeout(r, 2000)); // Debounce
            mutate(value)
        }
    }

    return (
        <div className="">
            <p className='text-red-500 first-letter:capitalize'>{error || ""}</p>
            <div className='flex items-center space-x-2'>
                <label htmlFor={product.id}>Qty:</label>
                <input
                    id={product.id}
                    className="transition-all grow w-full border-none rounded-md focus:outline-none focus:ring-priBlue-500 p-1"
                    type='number'
                    inputMode="numeric"
                    value={itemQty}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemQty(e.target.value)}
                    disabled={type === 'checkoutItem'}
                />
                <Transition
                    show={dirty}
                    className="transition-all duration-800 self-end"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Button
                        text={isLoading ? "" : 'Update'}
                        variant='outline'
                        modifier='px-9 py-1 min-w-[134px] flex-center'
                        glowEffect={false}
                        onClick={handleUpdateQty}
                        disabled={isLoading}
                    >
                        {isLoading && <Loading className='w-6 h-6 fill-priBlue-500 text-priBlack-200/50' />}
                    </Button>
                </Transition>
            </div>
        </div>
    )

}

//ShoppingCartItem
export default function ShoppingItem({ type = 'default', ...product }: Props) {
    const queryClient = useQueryClient()
    const { mutate, isLoading } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: (cartItemId: string) => axios.removeShoppingCart(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })
    function handleRemoveProduct(cartItemId: string) {
        mutate(cartItemId)
    }
    return (
        <article
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
                <QtyInput type={type} {...product} />
            </div>
            <div className='items-end flex flex-col'>
                <h1 className='font-semibold'>{fCurrency(product.price)}</h1>
                <p className='grow'></p>
                <Button
                    text='Remove'
                    variant='outline'
                    modifier='px-9 py-1 border-red-500'
                    glowEffect={false}
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={isLoading}
                />
            </div>
        </article>
    )
}