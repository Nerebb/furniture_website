import { useWishlistContext } from '@/contexts/wishListContext'
import axios from '@/libs/axiosApi'
import { fCurrency } from '@/libs/utils/numberal'
import { ProductCard } from '@/pages/api/products'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from 'classnames'
import { GetColorName } from 'hex-color-to-color-name'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import Button from '../Button'
import Chip from '../Chip'
import ImageLost from './ImageLost'
import Loading from './Loading'

const Banner = () => {
    const [selectedProduct, setSelectedProduct] = useState<ProductCard>()
    const { data: session } = useSession()
    const { userWishlist, addToWishList } = useWishlistContext()
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
                            <Image className='rounded-3xl object-fill md:object-cover h-full w-full' alt='' src={'/images/Mari.png'} width={1200} height={1024} priority />
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
                                {userWishlist && userWishlist.some(i => i.id === selectedProduct.id) && <Button
                                    text="Add Wishlist"
                                    variant='outline'
                                    glowModify='noAnimation'
                                    modifier='px-8 py-1 group-hover:text-white'
                                    onClick={() => addToWishList(selectedProduct.id)}
                                />}
                                <Button
                                    text="Add to cart"
                                    modifier='px-8 py-1'
                                    onClick={() => addToShoppingCart({ productId: selectedProduct.id, color: selectedProduct.colors[0], quantities: 1 })}
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