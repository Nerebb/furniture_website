import Button from '@/components/Button'
import Image from 'next/image'
import React from 'react'
import classNames from 'classnames'
import ProductCard from '@/components/ProductCard'

type Props = {}

export default function AccOrder({ }: Props) {
    return (
        <article className='space-y-3'>
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
            <ProductCard productStatus={true} />
        </article>
    )
}