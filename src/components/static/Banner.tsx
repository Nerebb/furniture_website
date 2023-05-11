import { ChatBubbleBottomCenterTextIcon, ChevronDownIcon, HandThumbUpIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import Button from '../Button'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from '@/libs/axiosApi'
import Loading from './Loading'
import { ProductCard } from '@/pages/api/products'
import ImageLost from './ImageLost'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { fCurrency } from '@/libs/utils/numberal'
import Chip from '../Chip'
import { GetColorName } from 'hex-color-to-color-name'

const Banner = () => {
    const [selectedProduct, setSelectedProduct] = useState<ProductCard>()
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { isLoading } = useQuery({
        queryKey: ['BannerProduct'],
        queryFn: () => axios.getProducts({ limit: 1 }),
        onSuccess: (data) => setSelectedProduct(data[0])
    })

    const { mutate: addToShoppingCart, isLoading: isLoadingShoppingCart } = useMutation({
        mutationKey: ['ShoppingCart'],
        mutationFn: ({ productId, color, quantities }: { productId: string, color: string, quantities?: number }) => axios.addToShoppingCart(productId, color, quantities),
        onSuccess: () => {
            queryClient.invalidateQueries()
        }
    })

    const { mutate: addToWishList } = useMutation({
        mutationKey: ['UserWishlist'],
        mutationFn: (productId: string) => axios.addToWishList(productId),
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries()
        },
        onError: (error: any) => toast.error(error)
    })

    return (
        <section className="rounded-3xl relative h-[calc(100vh-80px)] w-full mb-8">
            {isLoading &&
                <div className='w-full h-full flex-center'>
                    <Loading />
                </div>}
            {selectedProduct && (
                <>
                    <article className='relative h-full w-full overflow-hidden'>
                        {selectedProduct.imageUrl ? (
                            <Image className='rounded-3xl object-fill md:object-cover h-full w-full' alt='' src={'/images/Mari.png'} width={1200} height={1024} />
                        ) : (
                            <ImageLost />
                        )}
                    </article>
                    {session && <article className={classNames(
                        "group flex justify-between items-center w-full h-20 absolute px-5 bottom-0 rounded-b-3xl",
                        "transition-colors duration-300",
                        "hover:bg-priBlack-200/40 hover:backdrop-blur-1",
                    )}>
                        <aside>
                            <div className='flex space-x-2'>
                                <p className='first-letter:capitalize group-hover:text-white'>{selectedProduct.name}</p>
                                <Chip label={GetColorName(selectedProduct.colors[0])} color={selectedProduct.colors[0]} />
                            </div>
                            <p className='group-hover:text-white'>{fCurrency(selectedProduct.price)}</p>
                        </aside>
                        <aside >
                            <div className="Creator-contact flex items-center space-x-3">
                                {/* <HandThumbUpIcon className='w-9 h-9 p-1 text-white bg-priBlue-200 rounded-full cursor-pointer' /> */}
                                <Button
                                    text="Add Wishlist"
                                    variant='outline'
                                    glowModify='noAnimation'
                                    modifier='px-8 py-1 group-hover:text-white'
                                    onClick={() => addToWishList(selectedProduct.id)}
                                />
                                <Button
                                    text="Add to cart"
                                    modifier='px-8 py-1'
                                    onClick={() => addToWishList(selectedProduct.id)}
                                />
                            </div>
                        </aside>
                    </article>}
                </>
            )}
        </section>
    )
}

export default Banner