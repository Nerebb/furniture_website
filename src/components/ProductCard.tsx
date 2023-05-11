import useProductFilter from '@/hooks/useProductFilter'
import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductCard } from '@/pages/api/products'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { toast } from 'react-toastify'
import Card from './Card'
import Chip from './Chip'
import Loading from './static/Loading'

export type ProductCardProps = {
    type?:
    | 'horizontal'
    | 'vertical'
    product: ProductCard

    //Tailwind Modify
    modify?: {
        card?: string,
        text?: string,
        chip?: string,
    }
}

export default function ProductCard({ product, modify }: ProductCardProps) {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const categories = useProductFilter({ filter: 'category' })
    const price = fCurrency(product?.price as number)

    const { data: userWishlist, isLoading, isError } = useQuery({
        queryKey: ['UserWishlist'],
        queryFn: () => axios.getWishList(),
        enabled: !!session?.id
    })

    const { mutate: addToWishList } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: () => axios.addToWishList(product.id),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries()
        },
        onError: (error: any) => toast.error(error)
    })

    const { mutate: removeFromWishlist } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: () => axios.deleteWishlistProduct(product.id),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries()
        },
        onError: (error: any) => toast.error(error)
    })

    function handleAddWishList(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        addToWishList()
    }

    function handleRemoveFromWishlist(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        removeFromWishlist()
    }

    return product && (
        <Card modify={classNames(
            'relative group',
            modify?.card ? modify.card : 'min-w-[230px] aspect-3/4'
        )}>
            {categories.isLoading ? (
                <div className='h-full w-full flex-center'>
                    <Loading className='w-6 h-6 fill-priBlue-500 text-priBlack-200/50' />
                </div>
            ) : (
                <Link href={`/products/${product.id}`} id={product.id} className='h-full'>
                    <Image
                        className='rounded-3xl -z-10'
                        alt=''
                        src={typeof (product.imageUrl) === "string" ? product.imageUrl : product.imageUrl![0]}
                        fill
                        sizes="(max-width:1000px): 100vw"
                        priority={true}
                    />

                    <div className={classNames(
                        'hidden rounded-3xl group-hover:grid grid-rows-5 h-full backdrop-blur-sm bg-priBlack-200 bg-opacity-30 px-3', modify?.text
                    )}>
                        <div className='relative flex justify-end mt-2 group/wishlist'>
                            {session ? (
                                userWishlist && userWishlist.some(i => i.id === product.id) ? (
                                    <HeartIconSolid
                                        className='absolute w-8 h-8 text-priBlue-500 group-hover/wishlist:text-gray-500'
                                        onClick={handleRemoveFromWishlist}
                                    />
                                ) : (
                                    <HeartIconOutline
                                        className='absolute w-8 h-8 text-gray-500 group-hover/wishlist:text-priBlue-500'
                                        onClick={handleAddWishList}
                                    />
                                )
                            ) : (<></>)}
                        </div>
                        <div className='row-span-1'></div>
                        <div className='w-full self-end flex justify-between flex-wrap mb-2'>
                            <span className='first-letter:capitalize'>{product.name}</span>
                            <span className='text-priBlue-700'>{price}</span>
                        </div>
                        <div>
                            {product.colors?.length && product.colors?.map(i => (
                                <Chip
                                    key={i}
                                    label={GetColorName(i)}
                                    modify={modify?.chip}
                                    color={i}
                                />
                            ))}
                        </div>
                    </div>
                </Link>
            )}
        </Card>
    )
}