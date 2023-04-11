import React, { useState } from 'react'
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

type Props = shoppingCartItem

// Input component
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
                <Button
                    text='Remove'
                    variant='outline'
                    glowModify='noAnimation'
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={isLoading}
                />
            </div>
        </article>
    )
}