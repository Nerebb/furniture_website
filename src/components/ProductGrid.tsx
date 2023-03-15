import { useSearchContext } from '@/contexts/searchProductContext'
import axios from '@/libs/axiosApi'
import { ProductSearch } from '@/pages/api/products'
import { useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Button from './Button'
import Loading from './static/Loading'

type Props = ProductSearch & {
    queryKey: string[]
    loadMore: number,
    setLoadMore: Dispatch<SetStateAction<number>>
}
const productsPerLoad = 12

export default function ProductGrid({
    queryKey,
    loadMore,
    setLoadMore,
    cateId = [0],
    skip = 0,
    limit = productsPerLoad,
    available = false,
    colorHex,
    createdDate,
    creatorName,
    name,
    price,
    rating,
    roomId,
}: Props) {
    const { data: fetchedProducts, isError, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: ({ pageParam = { cateId, skip, limit, available, colorHex, createdDate, creatorName, name, price, rating, roomId } as ProductSearch }) => axios.getProducts({
            limit: pageParam.limit,
            skip: pageParam.skip,
            cateId: pageParam.cateId.includes(0) ? undefined : pageParam.cateId,
            available: pageParam.available,
            colorHex: pageParam.colorHex,
            createdDate: pageParam.createdDate,
            creatorName: pageParam.creatorName,
            name: pageParam.name,
            price: pageParam.price,
            rating: pageParam.rating,
            roomId: pageParam.roomId,
        }),
    })

    function handleLoadMore() {
        const curPage = loadMore + productsPerLoad;
        fetchNextPage({ pageParam: { skip: curPage, cateId } })
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
                <Loading />
            ) : (
                <div className='grid gap-5 grid-cols-4 my-5'>
                    {fetchedProducts?.pages.flat().map((item) => (
                        <Fragment key={item.id}>
                            <div id={item.id} className='h-auto relative rounded-2xl aspect-3/4 border-0.5 border-priBlack-100/50'>
                                {item.cateIds?.map(i => <span key={i.id} className="flex">CateID: {i.id}</span>)}
                                <Image className='rounded-2xl -z-10' alt='' src={typeof (item.imageUrl) === "string" ? item.imageUrl : item.imageUrl![0]} fill sizes="(max-width:1000px): 100vw" priority={true} />
                            </div>
                        </Fragment>
                    ))}
                </div>
            )}
            {/* Button */}
            <div className='w-full flex justify-center'>
                {isFetchingNextPage ? (
                    <Button text='Loading...' disabled />
                ) : (
                    fetchedProducts?.pages[fetchedProducts.pages.length - 1].length ? (
                        <Button text='Load more' onClick={handleLoadMore} />
                    ) : (
                        ""
                    )
                )}
            </div>
        </>
    )
}