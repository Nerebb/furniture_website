import React, { ReactNode, useContext, useMemo, useState } from 'react'
import { WishlistContext } from '.'
import { ProductCard } from '@/pages/api/products'

type Props = {
    children: ReactNode
}

export default function WishListProvider({ children }: Props) {
    const [wishlistContext, setWishlistContext] = useState<ProductCard[]>([])
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