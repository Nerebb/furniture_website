import { ProductCard, ProductSearch } from "@/pages/api/products";
import { UserShoppingCart } from "@/pages/api/user/shoppingCart";
import { CheckoutStage } from "@/pages/checkout";
import { createContext, Dispatch, SetStateAction } from "react";

//Passing SearchParams to route: /products to execute search method
export type SearchContext = {
    searchContext: ProductSearch
    setSearchContext: Dispatch<SetStateAction<ProductSearch>>
}
export const SearchProductContext = createContext<SearchContext | null>(null)


//Adding product to wishlist --- accross all pages
export type wishlistContext = {
    wishlistContext: ProductCard[]
    setWishlistContext: Dispatch<SetStateAction<ProductCard[]>>
}
export const WishlistContext = createContext<wishlistContext | null>(null)

/**
 * ShoppingCart ---Manage ShoppingCartItem and FrontEnd design
 * Header: Checkout Steps
 * OrderId through each components
 */
type TCheckout = {
    checkoutStage: CheckoutStage
    stripeClient: {
        orderId: string,
        updateQty: boolean
    }
}
export type checkoutContext = {
    checkoutContext: TCheckout
    setCheckoutContext: Dispatch<SetStateAction<TCheckout>>
}
export const CheckoutContext = createContext<checkoutContext | null>(null)