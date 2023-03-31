import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductSearch } from '@/pages/api/products'
import { UserShoppingCart } from '@/pages/api/user/shoppingCart'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { SearchProductContext, ShoppingCartContext } from '.'

type Props = {
    children: ReactNode
}

//Case 1 : Logined -> getShoppingCart
//Case 2 : Unlogined -> local storage

const initShoppingCart: UserShoppingCart = {
    id: "LocalStorage",
    shoppingCartItem: [],
    subTotal: "0",//BigInt to string
}

export default function ShoppingCartProvider({ children }: Props) {
    const [shoppingCartContext, setShoppingCartContext] = useState<UserShoppingCart>(initShoppingCart)
    const { data: session } = useSession()

    const { data: Cart, isError, isLoading } = useQuery({
        queryKey: ['ShoppingCart'],
        queryFn: () => axios.getShoppingCart(),
        enabled: Boolean(session),
        onSuccess: (data) => {
            setShoppingCartContext(data)
        }
    })

    if (isError) toast.error("Cannot load User Shopping Cart - please reload the page", { toastId: "ShoppingCart" })

    const subTotal = Cart?.subTotal ? fCurrency(parseInt(Cart?.subTotal)) : "None"

    return (
        <ShoppingCartContext.Provider value={{ ...shoppingCartContext, subTotal, isLoading, setShoppingCartContext }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}

export function useShoppingCartContext() {
    const context = useContext(ShoppingCartContext)
    if (!context) throw new Error("ShoppingCartContext must be used within <SearchProductContext.Provider/>")
    return { ...context }
}