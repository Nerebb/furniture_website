import { ResponseOrder } from "@/pages/api/order";
import { ProductCard, ProductSearch } from "@/pages/api/products";
import { CheckoutStage } from "@/pages/checkout";
import { Color, Room } from "@prisma/client";
import { UseMutateFunction } from "@tanstack/react-query";
import { Category } from "@types";
import { createContext, Dispatch, SetStateAction } from "react";

//Passing SearchParams to route: /products to execute search method
export type SearchContext = {
    searchContext: ProductSearch
    setSearchContext: Dispatch<SetStateAction<ProductSearch>>
}
export const SearchProductContext = createContext<SearchContext | null>(null)


//Adding product to wishlist --- accross all pages
export type wishlistContext = {
    userWishlist?: ProductCard[]
    addToWishList: UseMutateFunction<{ message: String; }, any, string, unknown>
    removeFromWishlist: UseMutateFunction<{ message: String; }, any, string, unknown>
}
export const WishlistContext = createContext<wishlistContext | null>(null)

export type CheckoutContextData = {
    checkoutStage: CheckoutStage,
    stripeClient: {
        orderDetail?: ResponseOrder,
        updateQty: boolean
    }
}
export type checkoutContext = {
    checkoutContext: CheckoutContextData
    setCheckoutContext: Dispatch<SetStateAction<CheckoutContextData>>
}
export const CheckoutContext = createContext<checkoutContext | null>(null)
