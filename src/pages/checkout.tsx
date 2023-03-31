import ShoppingCart from '@/components/static/ShoppingCart'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'
import React from 'react'

type Props = {}

export default function checkout({ }: Props) {
    return (
        <CheckoutLayout
            tabTitle='Order overview'
            leftSide={<>LeftSide</>}
            rightSide={<ShoppingCart />}
        />
    )
}