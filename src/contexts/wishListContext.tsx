import React, { ReactNode, useContext, useMemo, useState } from 'react'
import { WishlistContext } from '.'
import { ProductCard } from '@/pages/api/products'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import axios from '@/libs/axiosApi'
import { toast } from 'react-toastify'

type Props = {
    children: ReactNode
}

export default function WishListProvider({ children }: Props) {
    const [wishlistContext, setWishlistContext] = useState<ProductCard[]>([])
    const queryClient = useQueryClient()

    const { mutate: addToWishList } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.addToWishList(productId),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries()
        },
        onError: (error: any) => toast.error(error)
    })

    const { mutate: removeFromWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.deleteWishlistProduct(productId),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries()
        },
        onError: (error: any) => toast.error(error)
    })

    const wishlist = useMemo(() => ({ wishlistContext, setWishlistContext }), [wishlistContext, setWishlistContext])
    return (
        <WishlistContext.Provider value={{ ...wishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlistContext() {
    const content = useContext(WishlistContext)
    if (!content) throw new Error("searchContext must be used within <SearchProductContext.Provider/>")
    return { ...content }
}