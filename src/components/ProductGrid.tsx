import axios from '@/libs/axiosApi'
import { ProductSearch } from '@/pages/api/products'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import Button from './Button'
import ProductCard, { ProductCardProps } from './ProductCard'
import Loading from './static/Loading'
import useBrowserWidth from '@/hooks/useBrowserWidth'
import classNames from 'classnames'
import { useRouter } from 'next/router'

type Props = ProductSearch & {
    cardProps?: Omit<ProductCardProps, 'type' | 'product'>
    queryKey: any[]
    loadMore: number,
    setLoadMore: Dispatch<SetStateAction<number>>
}

export default function ProductGrid({
    queryKey,
    loadMore,
    setLoadMore,
    cateId = [0],
    skip = 0,
    limit,
    available = false,
    colorHex,
    createdDate,
    creatorName,
    name,
    fromPrice,
    toPrice,
    rating,
    roomId,
    cardProps
}: Props) {
    const browserWidth = useBrowserWidth()
    const router = useRouter()
    const productsPerLoad = browserWidth > 1028 ? 12 : browserWidth > 768 ? 8 : 6
    const { data: fetchedProducts, isError, error, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: ({ pageParam = { cateId, skip, limit: productsPerLoad, available, colorHex, createdDate, creatorName, name, fromPrice, toPrice, rating, roomId } as ProductSearch }) => axios.getProducts({
            limit: pageParam.limit,
            skip: pageParam.skip,
            cateId: pageParam.cateId.includes(0) ? undefined : pageParam.cateId,
            available: pageParam.available,
            colorHex: pageParam.colorHex,
            createdDate: pageParam.createdDate,
            creatorName: pageParam.creatorName,
            name: pageParam.name,
            fromPrice: pageParam.fromPrice,
            toPrice: pageParam.toPrice,
            rating: pageParam.rating,
            roomId: pageParam.roomId,
        }),
    })

    function handleLoadMore() {
        const curPage = loadMore + productsPerLoad;
        fetchNextPage({ pageParam: { skip: curPage, limit: productsPerLoad, cateId } })
        setLoadMore(curPage)
    }

    // if (data) setFetchedData(data)
    if (isError) {
        console.log(error)
        toast.error("Unknown error - please refresh the page")
    }
    return (
        <>
            {isLoading ? (
                <div className='w-full h-[200px] flex-center'>
                    <Loading />
                </div>
            ) : (
                <>
                    <div className={classNames(
                        'grid gap-5 mb-5 grid-cols-1 sm:grid-cols-2',
                        router.pathname !== '/' ? 'md:grid-cols-3' : 'md:grid-cols-4'
                    )}>
                        {fetchedProducts && fetchedProducts.pages.flat().map((item) => (
                            item &&
                            <Fragment key={item.id} >
                                <ProductCard type='horizontal' {...cardProps} product={item} />
                            </Fragment>
                        ))}
                    </div>

                    {/* Button */}
                    <div className='w-full flex justify-center'>
                        {isFetchingNextPage ? (
                            <Button text='Loading...' disabled />
                        ) : (
                            fetchedProducts && fetchedProducts.pages[fetchedProducts.pages.length - 1] && fetchedProducts.pages[fetchedProducts.pages.length - 1].length ? (
                                <Button text='Load more' onClick={handleLoadMore} modifier='px-9 py-1 dark:text-white' />
                            ) : (
                                ""
                            )
                        )}
                    </div>
                </>
            )
            }

        </>
    )
}