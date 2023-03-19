import axios from "@/libs/axiosApi"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import OrderProduct from "./OrderProduct"

type Props = {}

export default function AccOrder({ }: Props) {
    const { data: userOrders, isLoading, isError } = useQuery({
        queryKey: ["OrderProduct"],
        queryFn: () => axios.getUserOrders()
    })

    if (isError) toast.error("Something went wrong - please refresh the page")

    return (
        <article className='space-y-6'>
            {userOrders && userOrders.map(order => (
                <OrderProduct key={order.id} order={order} isLoading={isLoading} />
            ))}
        </article>
    )
}