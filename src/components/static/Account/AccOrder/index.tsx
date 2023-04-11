import Button from "@/components/Button"
import axios from "@/libs/axiosApi"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { toast } from "react-toastify"
import Loading from "../../Loading"
import NotFoundPage from "../../NotFoundPage"
import OrderProduct from "./OrderProduct"

type Props = {}

export default function AccOrder({ }: Props) {
    const router = useRouter()
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
            {isLoading &&
                <div className="flex-center">
                    <Loading />
                </div>
            }

            {userOrders?.pages.length ? (
                userOrders.pages.flat().map(order => (
                    <Fragment key={order.id}>
                        {
                            order && (
                                <OrderProduct key={order.id} order={order} isLoading={isLoading} />
                            )
                        }
                    </Fragment>
                ))
            ) : (
                <div className="flex-center flex-col">
                    <h1 className="font-semibold">No orders found</h1>
                    <button className="underline text-priBlue-500" onClick={() => router.push('/products')}>Continue shopping</button>
                </div>
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