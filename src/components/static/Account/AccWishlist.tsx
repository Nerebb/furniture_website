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