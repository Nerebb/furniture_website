import { ChatBubbleBottomCenterTextIcon, ChevronDownIcon, HandThumbUpIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import Button from '../Button'
import { useQuery } from "@tanstack/react-query"
import axios from '@/libs/axiosApi'
import Loading from './Loading'
import { ProductCard } from '@/pages/api/products'
import ImageLost from './ImageLost'
import classNames from 'classnames'

const Banner = () => {
    const [moreInfo, setMoreInfo] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<ProductCard>()

    const { isLoading } = useQuery({
        queryKey: ['BannerProduct'],
        queryFn: () => axios.getProducts({ limit: 1 }),
        onSuccess: (data) => setSelectedProduct(data[0])
    })

    const { data: creator, isLoading: creatorLoading } = useQuery({
        queryKey: ['BannerCreator'],
        queryFn: () => axios.getUser(selectedProduct!.creatorId),
        enabled: !!selectedProduct?.creatorId
    })

    function handleAddWishList() {

    }

    return (
        <section className="rounded-3xl relative h-[calc(100vh-80px)] w-full mb-8">
            {isLoading && <Loading />}
            {selectedProduct && (
                <>
                    <article className='relative h-full w-full overflow-hidden'>
                        {selectedProduct.imageUrl ? (
                            <Image className='rounded-3xl object-fill md:object-cover h-full w-full' alt='' src={'/images/Mari.png'} width={1200} height={1024} />
                        ) : (
                            <ImageLost />
                        )}
                    </article>
                    <article className={classNames(
                        "group flex justify-between items-center w-full h-20 absolute px-5 bottom-0 rounded-b-3xl",
                        "transition-colors duration-300",
                        "hover:bg-priBlack-200/40 hover:backdrop-blur-1",
                    )}>
                        {creator && (
                            <aside className="h-[60px] flex items-center space-x-3">
                                {creator.image ? (
                                    <Image className='rounded-full mr-5 w-[60px] h-[60px]' alt='' src={creator.image} width={60} height={60} />
                                ) : (
                                    <ImageLost className='rounded-full mr-5 w-[60px] h-[60px]' />
                                )}
                                <div className='flex flex-col justify-between'>
                                    <p className='title text-lg font-semibold text-black'>Nereb</p>
                                    <p className='text-black flex items-center group-hover:text-white'>
                                        <span className='mr-2'>Created on: 03/01/2023</span>
                                    </p>
                                </div>
                            </aside>
                        )}
                        <aside>
                            <div className="Creator-contact flex items-center space-x-3">
                                <HandThumbUpIcon className='w-9 h-9 p-1 text-white bg-priBlue-200 rounded-full cursor-pointer' />
                                <ChatBubbleBottomCenterTextIcon className='w-9 h-9 p-1 text-white transition-colors duration-300 hover:bg-priBlue-200 rounded-full cursor-pointer' />
                                <ShoppingCartIcon className='w-9 h-9 p-1 text-white transition-colors duration-300 hover:bg-priBlue-200 rounded-full cursor-pointer' />
                                <Button text="Add Wishlist" onClick={handleAddWishList} />
                            </div>
                        </aside>
                    </article>
                </>
            )}
        </section>
    )
}

export default Banner