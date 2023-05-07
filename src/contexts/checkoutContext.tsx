import React, { PropsWithChildren, useContext, useMemo, useState } from 'react'
import { CheckoutContext, CheckoutContextData } from '.'
import { CheckoutStage } from '@/pages/checkout'

type Props = {}

export const initCheckoutContext: CheckoutContextData = {
    checkoutStage: 0,
    stripeClient: {
        orderDetail: undefined,
        updateQty: false
    }
}

export default function CheckoutProvider({ children }: PropsWithChildren<Props>) {
    const [checkoutContext, setCheckoutContext] = useState(initCheckoutContext)
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