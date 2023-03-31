import axios from "@/libs/axiosApi"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import WishListProduct from "./WishListProduct"

type Props = {}


export default function AccWishlist({ }: Props) {
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList()
    })

    if (isError) toast.error('Something went wrong - please refresh the page')
    return (
        <article className='space-y-6'>
            {
                products?.map(product => (
                    <WishListProduct
                        key={product.id}
                        product={product}
                        isLoading={isLoading}
                    />
                ))
            }
        </article>
    )
}