import { useWishlistContext } from "@/contexts/wishListContext"
import { useRouter } from "next/router"
import WishListProduct from "./WishListProduct"
import { useQuery } from "@tanstack/react-query"
import axios from "@/libs/axiosApi"
import Loading from "../Loading"

type Props = {}


export default function AccWishlist({ }: Props) {
    const router = useRouter()
    const { data: products, isLoading } = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList(),
    })

    return (
        <article className='space-y-6'>
            {isLoading && (
                <div className="flex-center">
                    <Loading />
                </div>
            )}
            {products?.length ? products.map(product => (
                <WishListProduct
                    key={product.id}
                    product={product}
                />
            )) : (
                <div className='w-full text-center mt-5'>
                    <h1 className='text-xl'>No product found</h1>
                    <button
                        className='underline text-priBlue-500'
                        onClick={() => router.push('/')}
                    >
                        Return to homepage
                    </button>
                </div>
            )}
        </article>
    )
}