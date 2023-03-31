import Button from "@/components/Button"
import axios from "@/libs/axiosApi"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { Fragment, useState } from "react"
import { toast } from "react-toastify"
import NotFoundPage from "../../NotFoundPage"
import OrderProduct from "./OrderProduct"

type Props = {}

export default function AccOrder({ }: Props) {
    const [loadMore, setLoadMore] = useState<number>(0)
    const { data: userOrders, isLoading, isError, fetchNextPage } = useInfiniteQuery({
        queryKey: ["OrderProduct"],
        queryFn: ({ pageParam = { skip: 0 } }) => axios.getUserOrders(pageParam.skip),
    })

    if (isError) toast.error("Something went wrong - please refresh the page")

    function handleLoadMore() {
        fetchNextPage({ pageParam: { skip: loadMore + 5 } })
        setLoadMore(prev => prev + 5)
    }

    return (
        <article className='space-y-6'>
            {userOrders?.pages.length ? (
                userOrders.pages.flat().map(order => (
                    <Fragment key={order.id}>
                        {
                            order ? (
                                <OrderProduct key={order.id} order={order} isLoading={isLoading} />
                            ) : (
                                <NotFoundPage />
                            )
                        }
                    </Fragment>
                ))
            ) : (
                <NotFoundPage />
            )}

            {userOrders?.pages[userOrders.pages.length - 1].length ? (
                <div className="flex-center w-full">
                    <Button text="Load more" glowModify="noAnimation" onClick={handleLoadMore} />
                </div>
            ) : (
                <></>
            )}
        </article>
    )
}