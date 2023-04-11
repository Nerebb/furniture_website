import { ProductCard, ProductSearch } from "@/pages/api/products";
import { createContext, Dispatch, SetStateAction } from "react";

export type SearchContext = {
    searchContext: ProductSearch
    setSearchContext: Dispatch<SetStateAction<ProductSearch>>
}
export const SearchProductContext = createContext<SearchContext | null>(null)

export type wishlistContext = {
    wishlistContext: ProductCard[]
    setWishlistContext: Dispatch<SetStateAction<ProductCard[]>>
}
export const WishlistContext = createContext<wishlistContext | null>(null)