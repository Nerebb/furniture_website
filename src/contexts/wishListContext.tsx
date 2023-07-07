import React, { ReactNode, useContext, useMemo, useState } from 'react'
import { WishlistContext } from '.'
import { ProductCard } from '@/pages/api/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axios from '@/libs/axiosApi'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

type Props = {
    children: ReactNode
}

export default function WishListProvider({ children }: Props) {
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const userWishlist = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList(),
        enabled: Boolean(session)
    })

    const { mutate: addToWishList } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.addToWishList(productId),
        onSuccess: () => {
            toast.success("Product added to wishlist")
            queryClient.invalidateQueries({ queryKey: ['UserWishlist'] })
        },
        onError: (error: any) => {
            toast.error("Cannot add product to wishlist - please try again")
        }
    })

    const { mutate: removeFromWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.deleteWishlistProduct(productId),
        onSuccess: () => {
            toast.info("Product removed from wishlist")
            queryClient.invalidateQueries({ queryKey: ['UserWishlist'] })
        },
        onError: (error: any) => {
            toast.error("Cannot remove product from wishlist - please try again")
        }
    })


    return (
        <WishlistContext.Provider value={{ userWishlist: userWishlist.data, addToWishList, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlistContext() {
    const content = useContext(WishlistContext)
    if (!content) throw new Error("searchContext must be used within <SearchProductContext.Provider/>")
    return { ...content }
}