import Button from '@/components/Button'
import Card from '@/components/Card'
import Image from 'next/image'
import React from 'react'
import classNames from 'classnames'
import ProductCard from '@/components/ProductCard'

type Props = {}


export default function AccWishlist({ }: Props) {
    return (
        <article className='space-y-5'>
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
            <ProductCard productStatus={false} />
        </article>
    )
}