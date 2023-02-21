import ProductCard from '@/components/ProductCard'

type Props = {}

export default function AccOrder({ }: Props) {
    return (
        <article className='space-y-6'>
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