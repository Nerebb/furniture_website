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
    const [selectedProduct, setSelectedProduct] = useState<ProductCard>()

    const { isLoading } = useQuery({
        queryKey: ['BannerProduct'],
        queryFn: () => axios.getProducts({ limit: 1 }),
        onSuccess: (data) => setSelectedProduct(data[0])
    })

    function handleAddWishList() {

    }

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
                    <article className={classNames(
                        "group flex justify-end items-center w-full h-20 absolute px-5 bottom-0 rounded-b-3xl",
                        "transition-colors duration-300",
                        "hover:bg-priBlack-200/40 hover:backdrop-blur-1",
                    )}>
                        <aside >
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