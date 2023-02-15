import { ChatBubbleBottomCenterTextIcon, ChevronDownIcon, HandThumbUpIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { useState } from 'react'
import Button from './Button'

const Banner = () => {
    const [moreInfo, setMoreInfo] = useState<boolean>(false)
    return (
        <section className="rounded-3xl relative h-[calc(100vh-80px)] w-full">
            <article className='relative h-full w-full overflow-hidden'>
                <Image className='rounded-3xl object-fit' alt='' src={'/images/Mari.png'} fill />
            </article>
            <article className="w-full h-20 absolute px-5 bottom-0 flex justify-between items-center rounded-b-3xl transition-colors duration-300 group hover:bg-priBlack-200/40 hover:backdrop-blur-1">
                <aside className="h-[60px] flex justify-between items-center">
                    <Image className='rounded-full mr-5 w-[60px] h-[60px]' alt='' src={'/images/Mari.png'} width={60} height={60} />
                    <div className='flex flex-col justify-between'>
                        <p className='title text-lg font-semibold'>CreatorName</p>
                        <p className='MoreInfo text-gray-500 font-thin flex items-center group-hover:text-priBlue-200'>
                            <span className='mr-2'>More info</span>
                            <ChevronDownIcon className='w-3 h-3 cursor-pointer' onClick={() => setMoreInfo(!moreInfo)} />
                        </p>
                    </div>
                </aside>
                <aside>
                    <div className="Creator-contact w-[300px] flex justify-between items-center">
                        <HandThumbUpIcon className='w-9 h-9 p-1 text-white bg-priBlue-200 rounded-full cursor-pointer' />
                        <ChatBubbleBottomCenterTextIcon className='w-9 h-9 p-1 text-white transition-colors duration-300 hover:bg-priBlue-200 rounded-full cursor-pointer' />
                        <ShoppingCartIcon className='w-9 h-9 p-1 text-white transition-colors duration-300 hover:bg-priBlue-200 rounded-full cursor-pointer' />
                        <Button text="Buy now" />
                    </div>
                </aside>
            </article>
        </section>
    )
}

export default Banner