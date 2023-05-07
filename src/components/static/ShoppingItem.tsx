import React, { useState, useMemo } from 'react'
import ImageLost from './ImageLost'
import Image from 'next/image'
import { ShoppingCartItem } from '@/pages/api/user/shoppingCart'
import Chip from '../Chip'
import { GetColorName } from 'hex-color-to-color-name'
import { StarRating } from './StarRating'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '@/libs/axiosApi'
import Button from '../Button'
import { fCurrency } from '@/libs/utils/numberal'
import { Transition } from '@headlessui/react'
import Loading from './Loading'
import { toast } from 'react-toastify'

type Props = ShoppingCartItem

// Input component
function QtyInput({ ...product }: Props) {
    const [itemQty, setItemQty] = useState<string | number>(product.quantities)
    const [error, setError] = useState<string>("")
    const value = typeof itemQty !== 'number' ? parseInt(itemQty) : itemQty

    const dirty = value !== product.quantities ? true : false

    const queryClient = useQueryClient()

    const { mutate, isLoading } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: (newQty: number) => axios.updateShoppingCart(product.id, undefined, newQty),
        onSuccess: (data) => {
            queryClient.invalidateQueries()
            toast.success(data.message)
        },
        onError: (error: any) => {
            toast.error(error)
        }
    })

    async function handleUpdateQty() {
        if (value > product.available) {
            setError("Product OnStock not meet requirements")
            return
        } else {
            setError("")
            await new Promise(r => setTimeout(r, 2000)); // Debounce
            mutate(value)
        }
    }

    return (
        <div className="w-full">
            <p className='text-red-500 first-letter:capitalize whitespace-nowrap'>{error || ""}</p>
            <div className='flex items-center space-x-2 dark:text-white'>
                <label htmlFor={product.id}>Qty:</label>
                <input
                    id={product.id}
                    className="transition-all grow max-w-[80px] border-none rounded-md focus:outline-none focus:ring-priBlue-500 p-1 dark:bg-priBlack-400"
                    type='number'
                    inputMode="numeric"
                    min={0}
                    max={product.available}
                    value={itemQty}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemQty(e.target.value)}
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
export default function ShoppingItem({ ...product }: Props) {
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
                <h1 className='font-semibold first-letter:capitalize dark:text-white'>{product.name}</h1>

                <div>
                    <Chip label={GetColorName(product.color)} color={product.color} />
                </div>

                <div className='flex space-x-2'>
                    <StarRating ProductRating={product.avgRating} />
                    <div className='text-gray-500 dark:text-white'>{`(${product.totalRating})`}</div>
                </div>

                <p className='text-gray-500 dark:text-white'>OnStock: {product.available}</p>
                <p className='grow'></p>
                <QtyInput {...product} />
            </div>
            <div className='items-end flex flex-col'>
                <h1 className='font-semibold dark:text-white'>{fCurrency(product.price)}</h1>
                <p className='grow'></p>
                <Button
                    text='Remove'
                    variant='outline'
                    modifier='px-9 py-1 border-red-500 dark:text-white hover:text-red-500'
                    glowEffect={false}
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={isLoading}
                />
            </div>
        </article>
    )
}