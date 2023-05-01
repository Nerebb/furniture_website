import React, { PropsWithChildren, useContext, useMemo, useState } from 'react'
import { CheckoutContext } from '.'

type Props = {}

export default function CheckoutProvider({ children }: PropsWithChildren<Props>) {
    const [checkoutContext, setCheckoutContext] = useState({ checkoutStage: 0, stripeClient: { orderId: "", updateQty: false } })
    const values = useMemo(() => ({ checkoutContext, setCheckoutContext }), [checkoutContext, setCheckoutContext])
    return (
        <CheckoutContext.Provider value={values}>
            {children}
        </CheckoutContext.Provider>
    )
}

export function useCheckoutContext() {
    const content = useContext(CheckoutContext)
    if (!content) throw new Error("checkoutContext must be used within <SearchProductContext.Provider/>")
    return content
}