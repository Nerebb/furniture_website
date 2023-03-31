import { ProductSearch } from "@/pages/api/products";
import { UserShoppingCart } from "@/pages/api/user/shoppingCart";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext, Dispatch, SetStateAction } from "react";

export type SearchContext = {
    searchContext: ProductSearch
    setSearchContext: Dispatch<SetStateAction<ProductSearch>>
}
export const SearchProductContext = createContext<SearchContext | null>(null)

type TShoppingCartContext = {
    isLoading: boolean
    setShoppingCartContext: Dispatch<SetStateAction<UserShoppingCart>>
} & UserShoppingCart

export const ShoppingCartContext = createContext<TShoppingCartContext | null>(null)