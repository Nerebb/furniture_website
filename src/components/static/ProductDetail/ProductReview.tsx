import Button from '@/components/Button'
import Section from '@/layouts/Section'
import axios from '@/libs/axiosApi'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ProductComment from './ProductComment'

type Props = {
    productId: string
    loadReview: boolean
}

export default function ProductReview({ productId, loadReview }: Props) {
    const [loadMore, setLoadMore] = useState<number>(0)

    const { data: reviews, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['ProductComment'],
        queryFn: ({ pageParam = { productId, skip: 0, limit: 4 } }) => axios.getReviews({
            productId,
            limit: pageParam.limit,
            skip: pageParam.skip,
        }),
        enabled: loadReview
    })

    function handleLoadMore() {
        fetchNextPage({ pageParam: { productId, skip: loadMore + 4, limit: 4 } })
        setLoadMore(prev => prev + 4)
    }

    return (
        <Section title='Product reviews'>
            <div className='space-y-5 border-b border-priBlack-200/50 pb-5'>
                {reviews && reviews.pages && reviews.pages.flat().map(review => (
                    <ProductComment key={review.id} productId={productId} review={review} />
                ))}
                <div className='w-full flex justify-center'>
                    {isFetchingNextPage ? (
                        <Button text='Loading...' disabled modifier='px-9 py-1 dark:text-white' />
                    ) : (
                        reviews && reviews.pages[reviews.pages.length - 1] && reviews.pages[reviews.pages.length - 1].length && (
                            <Button text='Load more' onClick={handleLoadMore} modifier='px-9 py-1 dark:text-white' />
                        ))}
                </div>
            </div>
        </Section>
    )
}